import { Module, Provider } from '@nestjs/common';
import { UserController } from './auth.controller';
import {
  ClientsModule,
  Transport,
  ClientProxyFactory,
  ClientProxy,
} from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.auth';
import { JwtStrategy } from './jwt.strategy';

const clientProxyProvider: Provider = {
  provide: 'USER_SERVICE',
  useFactory: (): ClientProxy => {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue: process.env.USER_SERVICE_QUEUE,
        queueOptions: { durable: false },
      },
    });
  },
};

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: '6000s' },
    }),
  ],
  controllers: [UserController],
  providers: [AuthService, LocalStrategy, JwtStrategy, clientProxyProvider],
  exports: [clientProxyProvider],
})
export class AuthModule {}
