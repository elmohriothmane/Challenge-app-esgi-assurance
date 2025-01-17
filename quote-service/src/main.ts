import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue: process.env.QUOTE_SERVICE_QUEUE ,
        queueOptions: { durable: false },
      },
    },
  );
  app.listen().then(() => console.log('Microservice listening on RabbitMQ'));
}
bootstrap();
