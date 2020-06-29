using System;
using System.Collections.Generic;

namespace MPS.Models
{
    public partial class Car
    {
        public Car()
        {
            DriverCar = new HashSet<DriverCar>();
            Store = new HashSet<Store>();
        }

        public string Registration { get; set; }
        public string Make { get; set; }
        public string Model { get; set; }
        public string Colour { get; set; }

        public virtual ICollection<DriverCar> DriverCar { get; set; }
        public virtual ICollection<Store> Store { get; set; }
    }
}
