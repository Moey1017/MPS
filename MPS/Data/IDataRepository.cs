using Microsoft.AspNetCore.Mvc;
using MPS.Models;
using System.Collections.Generic;

namespace MPS.Data.Repository
{
    public interface IDataRepository
    {
        //Admin Interface Repository 
        public Admin AuthAdmin(string loginID);
        public bool RegisterAdmin(Admin admin);
        public bool RemoveAdmin(string login_id);

        //Store Interface Repository 
        public IEnumerable<Store> GetAllRegistration();
        public Store StoreCar(Store store);
        public Store RetrieveCar(string carReg);
        public bool IfStoreHasSpace();
        public bool IfCarRegExistInStore(string carReg);
        public bool InsertPallet(Store pallet);
        public bool RemovePallet(string pallet_id);

        //Store history Interface Repository 
        public IEnumerable<StoreHistory> GetAllStoreHistory();
        public bool InsertHistory(StoreHistory history);

        //Inbound order Interface Repository 
        public IEnumerable<InboundOrder> GetAllInboundOrders();
        public InboundOrder GetInboundOrder(string batch_id, string pallet_id);
        public bool InsertInboundOrder(InboundOrder inboundOrder);
        public bool UpdateInboundOrder(InboundOrder inboundOrder);

        //Outbound order Interface Repository 
        public IEnumerable<OutboundOrder> GetAllOutboundOrders();
        public OutboundOrder GetOutboundOrder(string batch_id, string pallet_id);
        public bool InsertOutboundOrder(OutboundOrder outboundOrder);
        public bool UpdateOutboundOrder(OutboundOrder outboundOrder);

        //Driver Interface Repository 
        public IEnumerable<Driver> GetAllDrivers();
        public Driver GetDriverByID(int id);
        public bool InsertDriver(Driver driver);
        public bool DeleteDriver(int id);
        public bool UpdateDriver(Driver driver);

        //Car Interface Repository 
        public IEnumerable<Car> GetAllCars();
        public Car GetCarByReg(string reg);
        public IEnumerable<Car> GetCarByDriver(int driver_id);
        public bool InsertCar(Car car);
        public bool DeleteCar(string reg);
        public bool UpdateCar(Car car);
    }
}