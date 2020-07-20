using System;
using System.Collections.Generic;

namespace MPS.Models
{
    public partial class DriverCar
    {
        public int Driver_id { get; set; }
        public string Registration { get; set; }

        public virtual Driver Driver { get; set; }
        public virtual Car RegistrationNavigation { get; set; }
    }
}
