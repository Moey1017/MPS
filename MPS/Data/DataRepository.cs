using Microsoft.Extensions.Configuration;
using System;
using MySql.Data.MySqlClient;
using Dapper;
using System.Collections.Generic;
using System.Linq;
using MPS.Models;

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
        public IEnumerable<Driver> getAllDrivers()
        {
            var sql = "SELECT driverID, name, telNo, email FROM drivers;";
            var result = this._conn.Query<Driver>(sql).ToList();
            return result;
        }

        public bool CreateDriver(Driver driver)
        {
            bool toReturn = false;

            var sql = "INSERT INTO `drivers`(`DriverID`, `Name`, `TelNo`, `Email`) VALUES(@DriverID, @Name, @TelNo, @Email);";

            var result = this._conn.Execute(sql,
                new
                {
                    driver.DriverId,
                    driver.Name,
                    driver.TelNo,
                    driver.Email
                });

            Console.WriteLine("Result: " + result);

            if (result == 1)
            {
                toReturn = true;
            }

            Console.WriteLine("ToReturn: " + toReturn);

            return toReturn;
        }



        //Car
        public IEnumerable<Car> getAllCars()
        {
            var sql = "SELECT registration, make, colour, model FROM cars;";
            var result = this._conn.Query<Car>(sql).ToList();
            return result;
        }


        //Driver_Car



        //Store
        public IEnumerable<Store> GetAllRegistration()
        {
            var sql = "SELECT palletID, registration FROM store ORDER BY palletID ASC;";
            var result = this._conn.Query<Store>(sql).ToList();
            return result;
        }
    }
}
