using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_dotnet.Models
{
    public class LeaderBoard
    {
        [Key]
        [ForeignKey("User")]
        public int User_Id { get; set; }

        [ForeignKey("User_Id")]
        public User? User { get; set; }

        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        [Required]
        public int Total_Score { get; set; }
    }
}