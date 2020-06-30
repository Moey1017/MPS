using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MPS.Data.Repository;
using MPS.Models;

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
        public IEnumerable<Driver> getAllDrivers()
        {
            var driversData = _dataRepository.getAllDrivers();
            return driversData;
        }

        [HttpPost("create-driver")]
        public IActionResult CreateDriver([FromBody] Driver driver)
        {
            //serverside validation require here 
            if (driver != null)
            {
                _dataRepository.CreateDriver(driver);
            }
            return Ok();
        }


    }
}
