//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;
//using Microsoft.AspNetCore.Mvc;
//using MPS.Data.Repository;
//using MPS.Data.Services;
//using MPS.Data.Models;

//namespace MPS.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class DriverController : Controller
//    {
//        private readonly IDataRepository _dataRepository;
//        public DriverController(IDataRepository dataRepository)
//        {
//            _dataRepository = dataRepository;
//        }

//        [HttpPost("create-driver")]
//        public IActionResult CreateDriver([FromBody]Driver driver)
//        {
//            if (driver != null)
//            {
//                _dataRepository.CreateDriver(driver);
//            }
//            return Ok();
//        }


//    }
//}
