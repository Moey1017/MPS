using Microsoft.AspNetCore.Mvc;
using MPS.Models;
using System.Collections.Generic;

namespace MPS.Data.Repository
{
    public interface IDataRepository
    {
        //Admin Interface Repository 
        public IEnumerable<Admin> GetAdmin(string loginID, string password);
        bool AdminExists(int admin);

        //Store Interface Repository 
        public IEnumerable<Store> GetAllRegistration();

        //Driver Interface Repository 
        public IEnumerable<Driver> GetAllDrivers();
        public IEnumerable<Driver> GetDriverByID(int id);
        public bool InsertDriver(Driver driver);
        public bool DeleteDriver(int id);
        public bool UpdateDriver(Driver driver);

        //Car Interface Repository 
        public IEnumerable<Car> GetAllCars();
        public bool InsertCar(Car car);
        public bool DeleteCar(string reg);
    }
}