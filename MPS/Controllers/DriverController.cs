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
        public IEnumerable<Driver> GetDriverByID(int ID)
        {
            var driversData = _dataRepository.GetDriverByID(ID); // getting the param here 
            return driversData;
        }

        [HttpPost("insert-driver")]
        public IActionResult InsertDriver([FromBody] Driver driver)
        {
            //serverside validation require here 
            if (driver.Name.Length > 2 && driver.TelNo.Length > 8 && driver.Email.Length != 0)
            {
                 //_dataRepository.InsertDriver(driver);
            }
            else
            {
                
            }
            _dataRepository.InsertDriver(driver);
            return Ok();
        }

        [HttpDelete("delete-driver{ID:int}")]
        public IActionResult DeleteDriver(int ID)
        {
            var result = _dataRepository.DeleteDriver(ID);
            return Ok(result);
        }

        [HttpPost("update-driver")]
        public IActionResult IActionResult([FromBody] Driver driver)
        {
            var result = _dataRepository.UpdateDriver(driver);
            return Ok(result);
        }
    }
}
