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
        public int Id{get ; set;}
        [Required]
        [MaxLength(50)]
        public string Username {get; set;} = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Email {get; set;} = string.Empty;
        [Required]
        [MaxLength(255)]
        public string PasswordHash {get; set;} = string.Empty;
        public DateTime CreatedAt{get; set;} = DateTime.Now;
        public int? AvatarId { get; set; }

        [ForeignKey("AvatarId")]
        public Avatar? Avatar { get; set; }
        public string? BackgroundColor { get; set; }
        public string? ProfileImage { get; set; }

    }
}