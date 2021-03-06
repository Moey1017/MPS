﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Update.Internal;
using MPS.Data.Repository;
using MPS.Models;

namespace MPS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OutboundController : ControllerBase
    {
        private readonly IDataRepository _dataRepository;
        public OutboundController(IDataRepository dataRepository)
        {
            _dataRepository = dataRepository;
        }

        [HttpGet("get-outboundOrders")]
        public IEnumerable<OutboundOrder> GetAllOutboundOrders()
        {
            var outboundOrders = _dataRepository.GetAllOutboundOrders();
            return outboundOrders;
        }

        [HttpGet("get-outboundOrder/{batch_id}/{pallet_id}")]
        public IActionResult GetOutboundOrder(string batch_id, string pallet_id)
        {
            var result = _dataRepository.GetOutboundOrder(batch_id, pallet_id); // getting the param here 
            return Ok(result);
        }

        [HttpPost("insert-outboundOrder")]
        public IActionResult InsertInboundOrder([FromBody] OutboundOrder outboundOrder)
        {
            //serverside validation require here 
            var result = _dataRepository.InsertOutboundOrder(outboundOrder);
            if(result)
                return Created("insert-outboundOrder", result);
            else
                return Conflict(outboundOrder);
        }

        //Update outbound order status 
        [HttpPut("update-outboundStatus")]
        public IActionResult UpdateInboundOrder([FromBody] OutboundOrder outboundOrder)
        {
            var result = _dataRepository.UpdateOutboundOrder(outboundOrder);
            if (result)
                return Accepted("update-outboundStatus", outboundOrder);
            else
                return Conflict(outboundOrder);
        }
    }
}
