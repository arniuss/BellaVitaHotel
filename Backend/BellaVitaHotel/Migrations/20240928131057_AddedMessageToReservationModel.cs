using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BellaVitaHotel.Migrations
{
    /// <inheritdoc />
    public partial class AddedMessageToReservationModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Message",
                table: "Reservations",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Message",
                table: "Reservations");
        }
    }
}
