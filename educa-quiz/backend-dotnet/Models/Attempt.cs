using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SeuProjeto.Models;

namespace backend_dotnet.Models
{
    public class Attempt
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; }
        
        public int QuizId { get; set; }
        [ForeignKey("QuizId")]
        public Quiz Quiz { get; set; }

        public int? Score { get; set; }
       
        public DateTime CompletedAt { get; set; } 
        
    }
}