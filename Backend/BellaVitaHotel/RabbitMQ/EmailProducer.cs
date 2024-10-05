using RabbitMQ.Client;
using System.Text;

namespace BellaVitaHotel.RabbitMQ
{
    public class EmailProducer
    {
        private const string QueueName = "emailQueue";

        public void SendEmailNotification(string email, string message)
        {
            var factory = new ConnectionFactory() { HostName = "goose.rmq2.cloudamqp.com",
                                                    UserName = "rvgikjmo",
                                                    Password = "8rbS9rNtrBSBmFSk68Hhn2b9G6PsInnL",
                                                    VirtualHost = "rvgikjmo"
            };

            using (var connection = factory.CreateConnection())
            using (var channel = connection.CreateModel())
            {
                channel.QueueDeclare(queue:  QueueName, durable: false, exclusive: false, autoDelete: false, arguments: null);

                var emailMessage = $"{email}:{message}";
                var body = Encoding.UTF8.GetBytes(emailMessage);

                channel.BasicPublish(exchange: "", routingKey: QueueName, basicProperties: null, body: body);
            }
        }
    }
}
