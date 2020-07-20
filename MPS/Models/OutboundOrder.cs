using System;
using System.Collections.Generic;

namespace MPS.Models
{
    public partial class OutboundOrder
    {
        public string Batch_id { get; set; }
        public string Pallet_id { get; set; }
        public int Order_pallet_count { get; set; }
        public DateTimeOffset? Expected_activation_time { get; set; }
        public string Status { get; set; }
        public int Index { get; set; }
        public string Source { get; set; }
        public int? Wms_link_id { get; set; }
        public int? Wms_request_status_read { get; set; }
        public int? Wms_output_status_read { get; set; }
        public DateTime? Automated_activation_time { get; set; }
        public long? Target { get; set; }
    }
}
