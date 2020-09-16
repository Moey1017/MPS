using System;
using System.Collections.Generic;

namespace MPS.Models
{
    public partial class StoreHistory
    {
        public int History_no { get; set; }
        public string Registration { get; set; }
        public string Activity { get; set; }
        public DateTimeOffset? Ts { get; set; }
    }
}
