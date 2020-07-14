using System;
using System.Collections.Generic;

namespace MPS.Models
{
    public partial class Store
    {
        public string PalletId { get; set; }
        public string Car_reg { get; set; }

        public virtual Car RegistrationNavigation { get; set; }
    }
}
