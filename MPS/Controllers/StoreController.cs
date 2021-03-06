﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MPS.Data.Repository;
using MPS.Models;
using Microsoft.AspNetCore.SignalR;

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

        [HttpPut("store-car")]
        public IActionResult StoreCar([FromBody] Store store)
        {
            //serverside validation require here 
            var result = _dataRepository.StoreCar(store);
            if (result != null)
                return Accepted("store-car", result); // return pallet id here
            else
                return Conflict(store.Car_reg);
        }

        [HttpPut("retrieve-car{carReg}")]
        public IActionResult UpdateCar(string carReg)
        {
            //return pallet id 
            var result = _dataRepository.RetrieveCar(carReg);
            if (result != null)
                return Accepted("retrieve-car", result);
            else
                return Conflict(carReg);
        }

        [HttpGet("ifHasSpace")]
        public IActionResult IfStoreHasSpace()
        {
            var result = _dataRepository.IfStoreHasSpace();
            return Ok(result);
        }

        [HttpGet("ifCarExistStore{carReg}")]
        public IActionResult IfCarRegExistInStore(string carReg)
        {
            var result = _dataRepository.IfCarRegExistInStore(carReg);
            return Ok(result);
        }

        [HttpPost("insert-pallet")]
        public IActionResult InsertPallet([FromBody] Store pallet)
        {
            Console.WriteLine(pallet.Pallet_id);
            Console.WriteLine(pallet.Car_reg);
            var result = _dataRepository.InsertPallet(pallet);
            if (result)
                return Created("insert-pallet", result);
            else
                return Conflict(pallet);
        }

        [HttpDelete("delete-pallet{pallet_id}")]
        public IActionResult DeletePallet(string pallet_id)
        {
            var result = _dataRepository.RemovePallet(pallet_id);
            if (result)
                return NoContent();
            else
                return NotFound();
        }
    }
}
