using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SeuProjeto.Models;

namespace backend_dotnet.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string Name { get; set; }

        [Required, MaxLength(150)]
        public string Email { get; set; }

        [Required, MaxLength(255)]
        public string Password { get; set; }

        public int AvatarId { get; set; }

        [ForeignKey("AvatarId")]
        public Avatar Avatar { get; set; }

        public int ColorId {get ; set; }
        [ForeignKey("ColorId")]
        public Color Color {get; set; }

        
        public DateTime CreatedAt { get; set; }   
        public DateTime UpdateAt {get; set; } 

        public ICollection<Attempt> Attempts { get; set; }
        public Leaderboard Leaderboard { get; set; }

    }
}