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

        [HttpPost("insert-outboundOrder")]
        public IActionResult InsertInboundOrder([FromBody] OutboundOrder outboundOrder)
        {
            //serverside validation require here 
            var result = _dataRepository.InsertOutboundOrder(outboundOrder);
            return Ok(result);  
        }
    }
}
