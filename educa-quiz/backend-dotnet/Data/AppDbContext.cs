using backend_dotnet.Models;
using Microsoft.EntityFrameworkCore;
using SeuProjeto.Models;

namespace backend_dotnet.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
            
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Quiz> Quizzes { get; set; }
        public DbSet<Attempt> Attempts { get; set; }
        public DbSet<Leaderboard> LeaderBoards { get; set; }
        public DbSet<Avatar> Avatars { get; set; }
        public DbSet<Color> Colors { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasOne(u => u.Avatar)
                .WithMany(a => a.Users)
                .HasForeignKey(u => u.AvatarId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasOne(u => u.Color)
                .WithMany(c => c.Users)
                .HasForeignKey(u => u.ColorId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .Property(u => u.CreatedAt)
                .HasColumnType("TIMESTAMP")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            modelBuilder.Entity<User>()
                .Property(u => u.UpdateAt)
                .HasColumnType("TIMESTAMP")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAddOrUpdate();

            modelBuilder.Entity<Quiz>()
                .Property(q => q.CreatedAt)
                .HasColumnType("TIMESTAMP")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            modelBuilder.Entity<Attempt>()
                .HasOne(at => at.User)
                .WithMany(u => u.Attempts)
                .HasForeignKey(at => at.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Attempt>()
                .HasOne(at => at.Quiz)
                .WithMany(q => q.Attempts)
                .HasForeignKey(at => at.QuizId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Attempt>()
                .Property(at => at.CompletedAt)
                .HasColumnType("TIMESTAMP")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            modelBuilder.Entity<Leaderboard>()
                .HasOne(lb => lb.User)
                .WithOne(u => u.Leaderboard)
                .HasForeignKey<Leaderboard>(lb => lb.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Leaderboard>()
                .Property(lb => lb.TotalScore)
                .HasDefaultValue(0);

            // Agora com unicidade nos nomes
            modelBuilder.Entity<Avatar>()
                .HasIndex(a => a.Name)
                .IsUnique();

            modelBuilder.Entity<Color>()
                .HasIndex(c => c.Name)
                .IsUnique();

            base.OnModelCreating(modelBuilder);
        }

    }

}