using backend_dotnet.Models;
using Microsoft.EntityFrameworkCore;

namespace backend_dotnet.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
            
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Quiz> Quizzes { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Answer> Answers { get; set; }
        public DbSet<Attempt> Attempts { get; set; }
        public DbSet<LeaderBoard> LeaderBoards { get; set; }
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

            modelBuilder.Entity<Quiz>()
                .HasOne(q => q.Creator)
                .WithMany(u => u.Quizzes)
                .HasForeignKey(q => q.CreatedBy)
                .OnDelete(DeleteBehavior.SetNull);
                 
            
            modelBuilder.Entity<Question>()
                .HasOne(q => q.Quiz)
                .WithMany(z => z.Questions)
                .HasForeignKey(q => q.QuizId)
                .OnDelete(DeleteBehavior.Cascade);
            
            modelBuilder.Entity<Answer>()
                .HasOne(a => a.Question)
                .WithMany(q => q.Answers)
                .HasForeignKey(a => a.QuestionId)
                .OnDelete(DeleteBehavior.Cascade);
            
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

            modelBuilder.Entity<LeaderBoard>()
                .HasOne(lb => lb.User)
                .WithOne(u => u.LeaderBoard)
                .HasForeignKey<LeaderBoard>(lb => lb.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            
            base.OnModelCreating(modelBuilder);
        }
    }
}