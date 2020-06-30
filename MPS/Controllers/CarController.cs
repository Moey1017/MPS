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
        public IEnumerable<Car> getAllCars()
        {
            var carsData = _dataRepository.getAllCars();
            return carsData;
        }
    }
}
