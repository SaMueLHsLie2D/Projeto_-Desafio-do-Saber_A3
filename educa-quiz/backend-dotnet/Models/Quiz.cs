using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
using backend_dotnet.Models;

namespace SeuProjeto.Models
{
    public class Quiz
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        // Armazena o JSON das questões
        [Required]
        public string Questions { get; set; }

        
        public DateTime CreatedAt { get; set; } 

        public ICollection<Attempt> Attempts { get; set; }
    }
}
