using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MPS.Models
{
    public partial class Car
    {
        [Required]
        public string Registration { get; set; }
        public int? Driver_id { get; set; }
        public string Make { get; set; }
        public string Model { get; set; }
        public string Colour { get; set; }
        public string driver_name { get; set; }
        public virtual Driver Driver { get; set; }
    }
}
