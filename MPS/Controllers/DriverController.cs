using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using MPS.Data.Repository;
using MPS.Models;
using Microsoft.EntityFrameworkCore;
using System.Net.Http;

namespace MPS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DriverController : ControllerBase
    {
        private readonly IDataRepository _dataRepository;
        public DriverController(IDataRepository dataRepository)
        {
            _dataRepository = dataRepository;
        }

        // Get all drivers
        [HttpGet("get-drivers")]
        public IEnumerable<Driver> GetAllDrivers()
        {
            var driversData = _dataRepository.GetAllDrivers();
            return driversData;
        }

        [HttpGet("get-driver-byID{ID:int}")]
        public IActionResult GetDriverByID(int ID)
        {
            var driver = _dataRepository.GetDriverByID(ID); // getting the param here 
            return Ok(driver);
        }

        [HttpPost("insert-driver")]
        public IActionResult InsertDriver([FromBody] Driver driver)
        {
            //serverside validation require here 
            //if (driver.Name.Length > 2 && driver.TelNo.Length > 8 && driver.Email.Length != 0)
            //{
            //     //_dataRepository.InsertDriver(driver);
            //}
            //else
            //{
            //return Conflict(driver);
            //}
            if(_dataRepository.InsertDriver(driver))
                return Created("insert-driver", driver);
            return Conflict(driver); // Status code 409 Failed to inserted
            
        }

        [HttpDelete("delete-driver{ID:int}")]
        public IActionResult DeleteDriver(int ID)
        {
            if(_dataRepository.DeleteDriver(ID))
                return NoContent();
            return NotFound();
        }

        [HttpPost("update-driver")]
        public IActionResult IActionResult([FromBody] Driver driver)
        {
            Console.WriteLine(driver);
            if(_dataRepository.UpdateDriver(driver))
                return Accepted("update-driver", driver);
            return Conflict(driver);
        }
    }
}
