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

        [HttpGet("get-car-byDriver{driver_id}")]
        public IActionResult GetCarByDriver(int driver_id)
        {
            var carData = _dataRepository.GetCarByDriver(driver_id);
            return Ok(carData);
        }

        [HttpPost("insert-car")]
        public IActionResult InsertCar([FromBody] Car car)
        {
            //serverside validation require here 
            var result = _dataRepository.InsertCar(car);
            if (result)
                return Created("insert-car", result);
            else
                return Conflict(car);
        }

        [HttpDelete("delete-car{Reg}")]
        public IActionResult DeleteDriver(string Reg)
        {
            var result = _dataRepository.DeleteCar(Reg);
            if(result)
                return NoContent();
            else
                return NotFound();
        }

        [HttpPut("update-car")]
        public IActionResult UpdateCar([FromBody] Car car)
        {
            var result = _dataRepository.UpdateCar(car);
            if (result)
                return Accepted("update-car", car);
            else
                return Conflict(car);
        }
    }
}
