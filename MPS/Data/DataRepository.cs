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



        //Driver Repository
        public IEnumerable<Driver> GetAllDrivers()
        {
            Console.WriteLine("Called GetAllDrivers");
            var query = "SELECT driverID, name, telNo, email FROM drivers;";
            var result = this._conn.Query<Driver>(query).ToList();
            return result;
        }

        //getting a driver 
        public IEnumerable<Driver> GetDriverByID(int id)
        {
            Console.WriteLine("Called GetDriverByID");
            var param = new { ID = id }; // bind param 
            var query = "SELECT driverID, name, telNo, email FROM drivers WHERE driverID = @ID;";
            var result = this._conn.Query<Driver>(query, param).ToList();
            return result;
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
            return false;
        }

        public bool UpdateDriver(Driver driver)
        {
            Console.WriteLine("UpdateDriver");
            var param = new
            {
                DriverID = driver.DriverId,
                Name = driver.Name,
                TelNo = driver.TelNo,
                Email = driver.Email
            };
            var query = "UPDATE drivers SET Name=@Name, TelNo=@TelNo, Email=@Email WHERE DriverID=@DriverID";
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



        //Driver_Car



        //Store
        public IEnumerable<Store> GetAllRegistration()
        {
            Console.WriteLine("Called GetAllRegistration");
            var query = "SELECT palletID, registration FROM store ORDER BY palletID ASC;";
            var result = this._conn.Query<Store>(query).ToList();
            return result;
        }
    }
}
