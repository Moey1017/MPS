using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MPS.Models
{
    public partial class Driver
    {
        public Driver()
        {
            Car = new HashSet<Car>();
        }
        [Required]
        public int Driver_id { get; set; }
        public string Name { get; set; }
        public string Tel_no { get; set; }
        public string Email { get; set; }

        public virtual ICollection<Car> Car { get; set; }
    }
}
