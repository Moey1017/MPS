using System;
using System.Collections.Generic;

namespace MPS.Models
{
    public partial class OutboundOrder
    {
        public string BatchId { get; set; }
        public string PalletId { get; set; }
        public int OrderPalletCount { get; set; }
        public DateTimeOffset? ExpectedActivationTime { get; set; }
        public string Status { get; set; }
        public int Index { get; set; }
        public string Source { get; set; }
        public int? WmsLinkId { get; set; }
        public int? WmsRequestStatusRead { get; set; }
        public int? WmsOutputStatusRead { get; set; }
        public DateTime? AutomatedActivationTime { get; set; }
        public long? Target { get; set; }
    }
}
