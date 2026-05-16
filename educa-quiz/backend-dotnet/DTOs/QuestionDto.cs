using System.ComponentModel.DataAnnotations;

namespace backend_dotnet.DTOs
{
    public class QuestionDto
    {
        [Required]
        public string Question { get; set; } 
          
          
        [Required]
        [MinLength(4)]
        [MaxLength(4)]
        public List<string> Options { get; set; }

        [Required, Range(0, 3)]
        public int Correct { get; set; }       
    }

}