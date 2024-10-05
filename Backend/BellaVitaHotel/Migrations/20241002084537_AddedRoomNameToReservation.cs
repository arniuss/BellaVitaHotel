using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BellaVitaHotel.Migrations
{
    /// <inheritdoc />
    public partial class AddedRoomNameToReservation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_Rooms_RoomID",
                table: "Reservations");

            migrationBuilder.AlterColumn<int>(
                name: "RoomID",
                table: "Reservations",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RoomName",
                table: "Reservations",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_Rooms_RoomID",
                table: "Reservations",
                column: "RoomID",
                principalTable: "Rooms",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_Rooms_RoomID",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "RoomName",
                table: "Reservations");

            migrationBuilder.AlterColumn<int>(
                name: "RoomID",
                table: "Reservations",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_Rooms_RoomID",
                table: "Reservations",
                column: "RoomID",
                principalTable: "Rooms",
                principalColumn: "ID");
        }
    }
}
