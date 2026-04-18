using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_dotnet.Models
{
    public class Answer
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public int QuestionId { get; set; }
        public Question Question { get; set; }

        [Required]
        public string AnswerText { get; set; }
        [Required]
        public bool IsCorrect { get; set; }
    }
}