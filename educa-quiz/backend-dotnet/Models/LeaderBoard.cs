using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_dotnet.Models
{
    public class LeaderBoard
    {
        [Key]
        [ForeignKey("User")]
        [Required]
        public int UserId { get; set; }
        public User User { get; set; }

        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        [Required]
        public int Total_Score { get; set; }
    }
}