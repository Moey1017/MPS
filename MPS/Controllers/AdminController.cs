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
//    public class AdminController : Controller
//    {
//        private readonly IDataRepository _dataRepository;
//        public AdminController(IDataRepository dataRepository)
//        {
//            _dataRepository = dataRepository;
//        }

//        [HttpGet("all")]
//        public IEnumerable<Admin> GetAdmin()
//        { 
//            var adminData = _dataRepository.GetAdmin("mpsAdminUsername", "$2y$12$v7E5wQzQyfsa0mr07eUFBOsEi5U7lmbpQ9cakKkUQnLEmMHbnec7y");
//            return adminData;
//        }
 
       
//    }
//}
