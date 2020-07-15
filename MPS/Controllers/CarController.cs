using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MPS.Data.Repository;
using MPS.Models;

namespace MPS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarController : ControllerBase
    {
        private readonly IDataRepository _dataRepository;
        public CarController(IDataRepository dataRepository)
        {
            _dataRepository = dataRepository;
        }

        // Get all cars
        [HttpGet("get-cars")]
        public IEnumerable<Car> GetAllCars()
        {
            var carsData = _dataRepository.GetAllCars();
            return carsData;
        }

        [HttpGet("get-car-byReg{REG}")]
        public IActionResult GetCarByReg(string REG)
        {
            var carData = _dataRepository.GetCarByReg(REG); // getting the param here 
            return Ok(carData);
        }

        [HttpPost("insert-car")]
        public IActionResult InsertCar([FromBody] Car car)
        {
            //serverside validation require here 
            if (_dataRepository.InsertCar(car))
                return Created("insert-car",car);
            return Conflict(car);
        }

        [HttpDelete("delete-car{Reg}")]
        public IActionResult DeleteDriver(string Reg)
        {
            var result = _dataRepository.DeleteCar(Reg);
            return Ok(result);
        }
    }
}
