using System;
using System.Collections.Generic;

namespace MPS.Models
{
    public partial class Schemaversions
    {
        public int Schemaversionid { get; set; }
        public string Scriptname { get; set; }
        public DateTimeOffset Applied { get; set; }
    }
}
