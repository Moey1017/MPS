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
        public bool InsertDriver(Driver driver);


        //Car Interface Repository 
        public IEnumerable<Car> GetAllCars();
    }
}