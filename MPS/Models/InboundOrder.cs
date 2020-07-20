using System;
using System.Collections.Generic;

namespace MPS.Models
{
    public partial class InboundOrder
    {
        public string Batch_id { get; set; }
        public string Pallet_id { get; set; }
        public int Order_pallet_count { get; set; }
        public DateTimeOffset? Expected_activation_time { get; set; }
        public string Sku_name { get; set; }
        public string Sku_code { get; set; }
        public string Status { get; set; }
        public int Max_pallet_height { get; set; }
        public int Pallet_width { get; set; }
        public int? Wms_receipt_link_id { get; set; }
        public int? Wms_request_status_read { get; set; }
        public int? Wms_storage_status_read { get; set; }
    }
}
