using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_dotnet.Models
{
    public class Quiz
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required, MaxLength(100)]
        public string Title { get; set; }
        [Required]
        public Difficulty Difficulty { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public ICollection<Question> Questions { get; set; }
        public ICollection<Attempt> Attempts { get; set; }

    }


public enum Difficulty
{
    Easy,
    Medium,
    Hard
}


}