using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MPS.Models;

namespace MPS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarController : ControllerBase
    {
        [HttpGet]
        public IEnumerable<Car> Get()
        {
            using (var context = new mpsContext())
            {
                return context.Car.ToList();
            }
        }
        

    }
}
