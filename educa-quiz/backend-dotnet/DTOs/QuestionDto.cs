using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace backend_dotnet.DTOs
{
    public class QuestionDto
    {
        [Required]
        [JsonPropertyName("question")]
        public string Question { get; set; } 
          
          
        [Required]
        [MinLength(4)]
        [MaxLength(4)]
        [JsonPropertyName("options")]
        public List<string> Options { get; set; }

        [Required, Range(0, 3)]
        [JsonPropertyName("correct")]
        public int Correct { get; set; }       
    }

}