using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MPS.Models
{
    public partial class Driver
    {
        public Driver()
        {
            DriverCar = new HashSet<DriverCar>();
        }

        [Required]
        public int? DriverId { get; set; }
        public string Name { get; set; }
        public string TelNo { get; set; }
        public string Email { get; set; }

        public virtual ICollection<DriverCar> DriverCar { get; set; }
    }
}
