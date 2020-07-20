using Microsoft.Extensions.Configuration;
using System;
using MySql.Data.MySqlClient;
using Dapper;
using System.Collections.Generic;
using System.Linq;
using MPS.Models;
using Microsoft.AspNetCore.Mvc;

namespace MPS.Data.Repository
{

    public class DataRepository : IDataRepository
    {
        // Create Connection with Database
        private readonly MySqlConnection _conn;
        public DataRepository(IConfiguration configuration)
        {
            _conn = new MySqlConnection(configuration["ConnectionStrings:MpsDbConnection"]);
        }



        //All methods with queries 
        //Admin
        public IEnumerable<Admin> GetAdmin(string login_id, string password)
        {
            throw new NotImplementedException();
        }

        public bool AdminExists(int adminId)
        {
            throw new NotImplementedException();
        }



        //Store
        public IEnumerable<Store> GetAllRegistration()
        {
            Console.WriteLine("Called GetAllRegistration");
            var query = "SELECT pallet_id, car_reg FROM store ORDER BY pallet_id ASC;";
            var result = this._conn.Query<Store>(query).ToList();
            return result;
        }

        public bool StoreCar(Store store)
        {
            Console.WriteLine("Called StoreCar");
            var query = "UPDATE store set car_reg=@car_reg "+
                "WHERE pallet_id=(SELECT pallet_id FROM store WHERE car_reg IS NULL ORDER BY pallet_id ASC LIMIT 1);";
            var param = new
            {
                car_reg = store.Car_reg
            };
            var result = this._conn.Execute(query, param);
            if (result == 1)
                return true;
            else
                return false;
        }

        public bool RetrieveCar(string carReg)
        {
            Console.WriteLine("RetrieveCar");
            var query = "UPDATE store set car_reg=NULL WHERE pallet_id=(SELECT pallet_id from store where car_reg=@car_reg);"; // needs to be changes 
            var param = new
            {
                car_reg = carReg
            };
            var result = this._conn.Execute(query, param);
            if (result == 1)
                return true;
            else
                return false;
        }

        //Inbound Order 
        public IEnumerable<InboundOrder> GetAllInboundOrders()
        {
            Console.WriteLine("Called GetAllInboundOrders");
            var query = "SELECT batch_id, pallet_id, order_pallet_count, expected_activation_time, sku_name, sku_code, " +
                "status, max_pallet_height, pallet_width, wms_receipt_link_id, wms_request_status_read, wms_storage_status_read" +
                " FROM inbound_order;"; 
            var result = this._conn.Query<InboundOrder>(query).ToList();
            return result;
        }

        public bool InsertInboundOrder(InboundOrder inboundOrder)
        {
            Console.WriteLine("Called InsertInboundOrder");
            bool toReturn = false;
            var query = "INSERT INTO inbound_order (batch_id, pallet_id, order_pallet_count, expected_activation_time, " +
                "sku_name, sku_code, status, max_pallet_height, pallet_width, wms_receipt_link_id, wms_request_status_read, wms_storage_status_read) " +
                "VALUES (CONCAT(UNIX_TIMESTAMP(),@batch_id), @pallet_id, @order_pallet_count, @expected_activation_time, @sku_name, @sku_code, " +
                "@status, @max_pallet_height, @pallet_width, @wms_receipt_link_id, @wms_request_status_read, @wms_storage_status_read);";
            var param = new
            {
                batch_id = inboundOrder.Batch_id,
                pallet_id = inboundOrder.Pallet_id,
                order_pallet_count = inboundOrder.Order_pallet_count,
                expected_activation_time = inboundOrder.Expected_activation_time,
                sku_name = inboundOrder.Sku_name,
                sku_code = inboundOrder.Sku_code,
                status = inboundOrder.Status,
                max_pallet_height = inboundOrder.Max_pallet_height,
                pallet_width = inboundOrder.Pallet_width,
                wms_receipt_link_id = inboundOrder.Wms_receipt_link_id,
                wms_request_status_read = inboundOrder.Wms_request_status_read,
                wms_storage_status_read = inboundOrder.Wms_storage_status_read
            };
            var result = this._conn.Execute(query, param);
            Console.WriteLine("Result: " + result);
            Console.WriteLine(inboundOrder + " has been added.");
            if (result == 1)
            {
                toReturn = true;
            }
            return toReturn;
        }

        public bool UpdateInboundOrder(InboundOrder inboundOrder)
        {
            Console.WriteLine("Called UpdateInboundOrder");
            var query = "UPDATE inbound_order SET status=@status "+
                    "WHERE pallet_id=@pallet_id";
            var param = new {
                pallet_id = inboundOrder.Pallet_id,
                status = inboundOrder.Status
            };
            var result = this._conn.Execute(query, param);
            if (result == 1)
                return true;
            else
                return false;
        }



        //Outbound Order 
        public IEnumerable<OutboundOrder> GetAllOutboundOrders()
        {
            Console.WriteLine("Called GetAllOutboundOrders");
            var query = "SELECT batch_id, pallet_id, order_pallet_count, expected_activation_time, status, `index`, source, wms_link_id," +
                " wms_request_status_read, wms_output_status_read, automated_activation_time, target " +
                "FROM outbound_order;"; 
            var result = this._conn.Query<OutboundOrder>(query).ToList();
            return result;
        }

        public bool InsertOutboundOrder(OutboundOrder outboundOrder)
        {
            Console.WriteLine("Called InsertOutboundOrder");
            bool toReturn = false;
            var query = "INSERT INTO outbound_order (batch_id, pallet_id, order_pallet_count, expected_activation_time, status, `index`," +
                " source, wms_link_id, wms_request_status_read, wms_output_status_read, automated_activation_time, target) " +
                "VALUES (CONCAT(UNIX_TIMESTAMP(),@batch_id), @pallet_id, @order_pallet_count, @expected_activation_time, @status, @index, @source, @wms_link_id, " +
                "@wms_request_status_read, @wms_output_status_read, NOW(), @target);";
            var result = this._conn.Execute(query,
                new
                {
                    batch_id = outboundOrder.Batch_id,
                    pallet_id = outboundOrder.Pallet_id,
                    order_pallet_count = outboundOrder.Order_pallet_count,
                    expected_activation_time = outboundOrder.Expected_activation_time,
                    status = outboundOrder.Status,
                    index = outboundOrder.Index,
                    source = outboundOrder.Source,
                    wms_link_id = outboundOrder.Wms_link_id,
                    wms_request_status_read = outboundOrder.Wms_request_status_read,
                    wms_output_status_read = outboundOrder.Wms_output_status_read,
                    //automated_activation_time = outboundOrder.Automated_activation_time,
                    target = outboundOrder.Target
                });
            Console.WriteLine("Result: " + result);
            Console.WriteLine(outboundOrder + " has been added.");
            if (result == 1)
            {
                toReturn = true;
            }
            return toReturn;
        }

        public bool IfCarRegExistInStore(string carReg)
        {
            Console.WriteLine("Called IfCarRegExistInStore");
            var query = "SELECT pallet_id from store WHERE car_reg=@car_reg;";
            var param = new
            {
                car_reg = carReg 
            };
            var result = this._conn.Query<int>(query, param).FirstOrDefault();
            Console.WriteLine(result);
            if (result != -1)
                return true;
            else
                return false;
        }

        public bool UpdateOutboundOrder(OutboundOrder outboundOrder)
        {
            Console.WriteLine("Called UpdateInboundOrder");
            var query = "UPDATE outbound_order SET status=@status " +
                    "WHERE pallet_id=@pallet_id";
            var param = new
            {
                pallet_id = outboundOrder.Pallet_id,
                status = outboundOrder.Status
            };
            var result = this._conn.Execute(query, param);
            if (result == 1)
                return true;
            else
                return false;
        }

        //Driver Repository
        public IEnumerable<Driver> GetAllDrivers()
        {
            Console.WriteLine("Called GetAllDrivers");
            var query = "SELECT driver_id, name, tel_no, email FROM drivers;";
            var result = this._conn.Query<Driver>(query).ToList();
            return result;
        }

        //Get a driver 
        public Driver GetDriverByID(int id)
        {
            Console.WriteLine("Called GetDriverByID");
            var param = new { ID = id }; // bind param 
            var query = "SELECT driver_id, name, tel_no, email FROM drivers WHERE driver_id = @ID;";
            var result = this._conn.Query<Driver>(query, param).ToList();
            return result.FirstOrDefault();
        }

        public bool InsertDriver(Driver driver)
        {
            Console.WriteLine("Called InsertDriver");
            Console.WriteLine(driver.Name);
            bool toReturn = false;
            var query = "INSERT INTO `drivers`(`driver_id`, `name`, `tel_no`, `email`) VALUES(@driver_id, @name, @tel_no, @email);";
            var result = this._conn.Execute(query,
                new
                {
                    driver_id = driver.Driver_id,
                    name = driver.Name,
                    tel_no = driver.Tel_no,
                    email = driver.Email
                });
            Console.WriteLine("Result: " + result);
            Console.WriteLine(driver + " has been added.");
            if (result == 1)
            {
                toReturn = true;
            }
            return toReturn;
        }

        public bool DeleteDriver(int id)
        {
            Console.WriteLine("Called DeleteDriver");
            var param = new { ID = id }; // bind param 
            var query = "DELETE FROM drivers WHERE driver_id = @ID";
            var result = this._conn.Execute(query, param);
            if(result == 1)
            {
                Console.WriteLine("Driver id:" + id + " has been Deleted.");
                return true;
            }
            else
                return false;
        }

        public bool UpdateDriver(Driver driver)
        {
            Console.WriteLine("Called UpdateDriver");
            var param = new
            {
                driver_id = driver.Driver_id,
                name = driver.Name,
                tel_no = driver.Tel_no,
                email = driver.Email
            };
            var query = "UPDATE drivers SET name=@name, tel_no=@tel_no, email=@email WHERE driver_id=@driver_id";
            var result = this._conn.Execute(query, param);
            if (result == 1)
                return true;
            else
                return false;
        }

        //Car
        public IEnumerable<Car> GetAllCars()
        {
            Console.WriteLine("Called GetAllCars");
            var query = "SELECT registration, make, colour, model FROM cars;";
            var result = this._conn.Query<Car>(query).ToList();
            return result;
        }

        public Car GetCarByReg(string reg)
        {
            Console.WriteLine("Called GetCarByID");
            var param = new { REG = reg }; // bind param 
            var query = "SELECT registration, make, model, colour from cars WHERE registration=@REG;";
            var result = this._conn.Query<Car>(query, param);
            return result.FirstOrDefault();
        }

        public bool InsertCar(Car car)
        {
            Console.WriteLine("Called InsertCar");
            bool toReturn = false;
            var query = "INSERT INTO cars(registration, make, model, colour) VALUES(@registration, @make, @model, @colour);";
            var result = this._conn.Execute(query,
                new
                {
                    registration = car.Registration,
                    make = car.Make,
                    model = car.Model,
                    colour = car.Colour
                });
            Console.WriteLine("Result: " + result);
            Console.WriteLine(car + " has been added.");
            if (result == 1)
            {
                toReturn = true;
            }
            return toReturn;
        }

        public bool DeleteCar(string reg)
        {
            Console.WriteLine("Called DeleteCar");
            var param = new { REG = reg }; // bind param 
            var query = "DELETE FROM cars WHERE registration = @REG";
            var result = this._conn.Execute(query, param);
            if (result == 1)
            {
                Console.WriteLine("Car reg:" + reg + " has been Deleted.");
                return true;
            }
            return false;
        }

        public bool UpdateCar(Car car)
        {
            Console.WriteLine("Called UpdateCar");
            var param = new
            {
                registration = car.Registration,
                make = car.Make,
                model = car.Model,
                colour = car.Colour
            };
            var query = "UPDATE cars SET make=@make, model=@model, colour=@colour WHERE registration=@registration";
            var result = this._conn.Execute(query, param);
            if (result == 1)
                return true;
            else
                return false;
        }

        //Driver_Car


    }
}
