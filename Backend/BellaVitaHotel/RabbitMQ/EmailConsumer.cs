using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Net.Mail;
using System.Net;
using System.Text;

namespace BellaVitaHotel.RabbitMQ
{
    public class EmailConsumer
    {
        private const string QueueName = "emailQueue";

        public void StartConsuming()
        {
            var factory = new ConnectionFactory()
            {
                HostName = "goose.rmq2.cloudamqp.com",
                UserName = "rvgikjmo",
                Password = "8rbS9rNtrBSBmFSk68Hhn2b9G6PsInnL",
                VirtualHost = "rvgikjmo"
            };

            using (var connection = factory.CreateConnection())
            using (var channel = connection.CreateModel())
            {
                channel.QueueDeclare(queue: QueueName, durable: false, exclusive: false, autoDelete: false, arguments: null);

                var consumer = new EventingBasicConsumer(channel);

                consumer.Received += (model, ea) =>
                {
                    var body = ea.Body.ToArray();
                    var message = Encoding.UTF8.GetString(body);
                    var parts = message.Split(':');
                    var email = parts[0];
                    var emailMessage = parts[1];

                    SendEmail(email, emailMessage);
                };
            }
        }
        private void SendEmail(string email, string message)
        {
            using (var smtpClient = new SmtpClient("smtp.example.com", 587))
            {
                smtpClient.Credentials = new NetworkCredential("your_email@example.com", "your_password");
                smtpClient.EnableSsl = true;

                var mailMessage = new MailMessage("your_email@example.com", email)
                {
                    Subject = "Reservation Confirmation",
                    Body = message,
                    IsBodyHtml = false,
                };

                smtpClient.Send(mailMessage);
            }
        }
    }
}
