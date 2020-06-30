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
    public class StoreController : Controller
    {
        private readonly IDataRepository _dataRepository;
        public StoreController(IDataRepository dataRepository)
        {
            _dataRepository = dataRepository;
        }

        [HttpGet("get-store-state")]
        public IEnumerable<Store> GetAllRegistration()
        {
            var registrationData = _dataRepository.GetAllRegistration();
            return registrationData;
        }
    }
}
