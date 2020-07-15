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
        public IEnumerable<Admin> GetAdmin(string loginID, string password)
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
            var query = "SELECT palletID, car_reg FROM store ORDER BY palletID ASC;";
            var result = this._conn.Query<Store>(query).ToList();
            return result;
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
                "VALUES (@batch_id, @pallet_id, @order_pallet_count, @expected_activation_time, @sku_name, @sku_code, " +
                "@status, @max_pallet_height, @pallet_width, @wms_receipt_link_id, @wms_request_status_read, @wms_storage_status_read);";
            var result = this._conn.Execute(query,
                new
                {
                    inboundOrder.BatchId,
                    inboundOrder.PalletId,
                    inboundOrder.OrderPalletCount,
                    inboundOrder.ExpectedActivationTime,
                    inboundOrder.SkuName,
                    inboundOrder.SkuCode,
                    inboundOrder.Status,
                    inboundOrder.MaxPalletHeight,
                    inboundOrder.PalletWidth,
                    inboundOrder.WmsReceiptLinkId,
                    inboundOrder.WmsRequestStatusRead,
                    inboundOrder.WmsStorageStatusRead
                });
            Console.WriteLine("Result: " + result);
            Console.WriteLine(inboundOrder + " has been added.");
            if (result == 1)
            {
                toReturn = true;
            }
            return toReturn;
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
            Console.WriteLine("Called InsertDriver");
            bool toReturn = false;
            var query = "INSERT INTO outbound_order (batch_id, pallet_id, order_pallet_count, expected_activation_time, status, `index`," +
                " source, wms_link_id, wms_request_status_read, wms_output_status_read, automated_activation_time, target) " +
                "VALUES (@batch_id, @pallet_id, @order_pallet_count, @expected_activation_time, @status, @index, @source, @wms_link_id, " +
                "@wms_request_status_read, @wms_output_status_read, @automated_activation_time, @target);";
            var result = this._conn.Execute(query,
                new
                {
                    outboundOrder.BatchId,
                    outboundOrder.PalletId,
                    outboundOrder.OrderPalletCount,
                    outboundOrder.ExpectedActivationTime, 
                    outboundOrder.Status,
                    outboundOrder.Index,
                    outboundOrder.Source,
                    outboundOrder.WmsLinkId,
                    outboundOrder.WmsRequestStatusRead,
                    outboundOrder.WmsOutputStatusRead,
                    outboundOrder.AutomatedActivationTime,
                    outboundOrder.Target
                });
            Console.WriteLine("Result: " + result);
            Console.WriteLine(outboundOrder + " has been added.");
            if (result == 1)
            {
                toReturn = true;
            }
            return toReturn;
        }



        //Driver Repository
        public IEnumerable<Driver> GetAllDrivers()
        {
            Console.WriteLine("Called GetAllDrivers");
            var query = "SELECT driverID, name, telNo, email FROM drivers;";
            var result = this._conn.Query<Driver>(query).ToList();
            return result;
        }

        //getting a driver 
        public Driver GetDriverByID(int id)
        {
            Console.WriteLine("Called GetDriverByID");
            var param = new { ID = id }; // bind param 
            var query = "SELECT driverID, name, telNo, email FROM drivers WHERE driverID = @ID;";
            var result = this._conn.Query<Driver>(query, param).ToList();
            return result.FirstOrDefault();
        }

        public bool InsertDriver(Driver driver)
        {
            Console.WriteLine("Called InsertDriver");
            bool toReturn = false;
            var query = "INSERT INTO `drivers`(`DriverID`, `Name`, `TelNo`, `Email`) VALUES(@DriverID, @Name, @TelNo, @Email);";
            var result = this._conn.Execute(query,
                new
                {
                    driver.DriverId,
                    driver.Name,
                    driver.TelNo,
                    driver.Email
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
            var query = "DELETE FROM drivers WHERE driverID = @ID";
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
                driver.DriverId,
                driver.Name,
                driver.TelNo,
                driver.Email
            };
            var query = "UPDATE drivers SET Name=@Name, TelNo=@TelNo, Email=@Email WHERE DriverID=@DriverId";
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
            var query = "INSERT INTO `cars`(`Registration`, `Make`, `Model`, `Colour`) VALUES(@Registration, @Make, @Model, @Colour);";
            var result = this._conn.Execute(query,
                new
                {
                    car.Registration,
                    car.Make,
                    car.Model,
                    car.Colour
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
            var query = "DELETE FROM cars WHERE Registration = @REG";
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
                car.Registration,
                car.Make,
                car.Model,
                car.Colour
            };
            var query = "UPDATE cars SET Make=@Make, Model=@Model, Colour=@Colour WHERE Registration=@Registration";
            var result = this._conn.Execute(query, param);
            if (result == 1)
                return true;
            else
                return false;
        }

        //Driver_Car


    }
}
