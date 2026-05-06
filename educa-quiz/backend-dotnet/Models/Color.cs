using System.ComponentModel.DataAnnotations;

namespace backend_dotnet.Models
{
    public class Color
    {
        [Key]
        public int Id {get; set; }
        
        [Required]
        [MaxLength(50)]
        public string Name { get; set; }

        [Required]
        [MaxLength(20)]
        public string HexValue { get; set; }
        public ICollection<User> Users { get; set; } = new List<User>();
        
    }
}