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
    public class AdminController : Controller
    {
        private readonly IDataRepository _dataRepository;
        public AdminController(IDataRepository dataRepository)
        {
            _dataRepository = dataRepository;
        }

        [HttpGet("auth-admin{login_id}")]
        public IActionResult GetAdmin(string login_id)
        {
            var adminData = _dataRepository.AuthAdmin(login_id);
            return Ok(adminData);
        }

        [HttpPost("register-admin")]
        public IActionResult RegisterAdmin([FromBody] Admin admin)
        {
            //serverside validation require here 
            var result = _dataRepository.RegisterAdmin(admin);
            if (result)
                return Created("register-admin", result);
            else
                return Conflict(admin);
        }

        [HttpDelete("remove-admin{login_id}")]
        public IActionResult RemoveAdmin(string login_id)
        {
            var result = _dataRepository.RemoveAdmin(login_id);
            if (result)
                return NoContent();
            else
                return NotFound();
        }
    }
}
