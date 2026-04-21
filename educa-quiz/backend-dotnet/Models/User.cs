using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_dotnet.Models
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required, MaxLength(50)]
        public string Username { get; set; }
        [Required, MaxLength(100)]
        public string Email { get; set; }
        [Required, MaxLength(255)]
        public string PasswordHash { get; set; }
        [MaxLength(255)]
        public string ProfileImage { get; set; }
        [MaxLength(255)]
        public string BackgroundImage { get; set; }
        [MaxLength(20)]
        public string BackgroundColor { get; set; }

        public int? AvatarId { get; set; }
        public Avatar Avatar { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public ICollection<Attempt> Attempts { get; set; }
        public LeaderBoard LeaderBoard { get; set; }

    }
}