using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backenddotnet.Migrations
{
    /// <inheritdoc />
    public partial class MeuBancoDados : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LeaderBoards_Users_UserId",
                table: "LeaderBoards");

            migrationBuilder.DropPrimaryKey(
                name: "PK_LeaderBoards",
                table: "LeaderBoards");

            migrationBuilder.RenameTable(
                name: "LeaderBoards",
                newName: "Leaderboards");

            migrationBuilder.RenameIndex(
                name: "IX_LeaderBoards_UserId",
                table: "Leaderboards",
                newName: "IX_Leaderboards_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Leaderboards",
                table: "Leaderboards",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Leaderboards_Users_UserId",
                table: "Leaderboards",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Leaderboards_Users_UserId",
                table: "Leaderboards");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Leaderboards",
                table: "Leaderboards");

            migrationBuilder.RenameTable(
                name: "Leaderboards",
                newName: "LeaderBoards");

            migrationBuilder.RenameIndex(
                name: "IX_Leaderboards_UserId",
                table: "LeaderBoards",
                newName: "IX_LeaderBoards_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_LeaderBoards",
                table: "LeaderBoards",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_LeaderBoards_Users_UserId",
                table: "LeaderBoards",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
