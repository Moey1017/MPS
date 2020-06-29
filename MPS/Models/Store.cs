using System;
using System.Collections.Generic;

namespace MPS.Models
{
    public partial class Store
    {
        public short StoreId { get; set; }
        public string Registration { get; set; }

        public virtual Car RegistrationNavigation { get; set; }
    }
}
