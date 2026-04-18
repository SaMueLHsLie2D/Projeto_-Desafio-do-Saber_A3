using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend_dotnet.Dtos
{
    public class UpdateProfileDto
    {
        public int? AvatarId { get; set; }
        public string BackgroundColor { get; set; }
        
    }
}