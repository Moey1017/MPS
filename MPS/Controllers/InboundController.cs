﻿using System;
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
    public class InboundController : ControllerBase
    {
        private readonly IDataRepository _dataRepository;
        public InboundController(IDataRepository dataRepository)
        {
            _dataRepository = dataRepository;
        }

        // Get all inbound_orders
        [HttpGet("get-inboundOrders")]
        public IEnumerable<InboundOrder> GetAllInboundOrders()
        {
            var inboundOrders = _dataRepository.GetAllInboundOrders();
            return inboundOrders;
        }

        [HttpPost("insert-inboundOrder")]
        public IActionResult InsertInboundOrder([FromBody] InboundOrder inboundOrder)
        {
            //serverside validation require here 
            var result = _dataRepository.InsertInboundOrder(inboundOrder);
            if(result)
                return Created("insert-inboundOrder", result);
            else
                return Conflict(inboundOrder);
        }

        //Update inbound order status 
        [HttpPut("update-inboundStatus")]
        public IActionResult UpdateInboundOrder([FromBody] InboundOrder inboundOrder)
        {
            var result = _dataRepository.UpdateInboundOrder(inboundOrder);
            if (result)
                return Accepted("update-inboundStatus", inboundOrder);
            else
                return Conflict(inboundOrder);
        }
    }
}
