using System;
using System.Collections.Generic;

namespace MPS.Models
{
    public partial class InboundOrder
    {
        public string BatchId { get; set; }
        public string PalletId { get; set; }
        public int OrderPalletCount { get; set; }
        public DateTimeOffset? ExpectedActivationTime { get; set; }
        public string SkuName { get; set; }
        public string SkuCode { get; set; }
        public string Status { get; set; }
        public int MaxPalletHeight { get; set; }
        public int PalletWidth { get; set; }
        public int? WmsReceiptLinkId { get; set; }
        public int? WmsRequestStatusRead { get; set; }
        public int? WmsStorageStatusRead { get; set; }
    }
}
