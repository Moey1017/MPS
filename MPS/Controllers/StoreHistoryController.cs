using System;
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
    public class StoreHistoryController : Controller
    {
        private readonly IDataRepository _dataRepository;
        public StoreHistoryController(IDataRepository dataRepository)
        {
            _dataRepository = dataRepository;
        }

        [HttpGet("get-store-history")]
        public IEnumerable<StoreHistory> GetAllStoreHistory()
        {
            var storeHistoryData = _dataRepository.GetAllStoreHistory();
            return storeHistoryData;
        }

        [HttpPost("insert-history")]
        public IActionResult InsertHistory([FromBody] StoreHistory history)
        {
            var result = _dataRepository.InsertHistory(history);
            if (result)
                return Created("insert-history", result);
            else
                return Conflict(history);
        }
    }
}
