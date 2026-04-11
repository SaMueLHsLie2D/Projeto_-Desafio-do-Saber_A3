using System.ComponentModel.DataAnnotations;

namespace backend_dotnet.Models
{
    public class User
    {
        [Key]
        public int Id{get ; set;}
        [Required]
        [MaxLength(50)]
        public string Username{get; set;}
        [Required]
        [MaxLength(100)]
        public string Email {get; set;}
        [Required]
        [MaxLength(255)]
        public string PasswordHash{get; set;}
        public DateTime CreatedAt{get; set;} = DateTime.Now;   
        
    }
}