import { Module } from '@nestjs/common';
import { AuthModule } from '@auth/auth.module';
import { DatabaseModule } from '@config/database';
import { UsersModule } from './users/users.module';

@Module({
  imports: [DatabaseModule, AuthModule, UsersModule],
})
export class AppModule {}
