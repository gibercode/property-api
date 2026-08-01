import { Module } from '@nestjs/common';
import { AuthModule } from '@auth/auth.module';
import { DatabaseModule } from '@config/database';
import { InmueblesModule } from './inmuebles/inmuebles.module';
import { TiposInmuebleModule } from './tipos-inmueble/tipos-inmueble.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    InmueblesModule,
    TiposInmuebleModule,
  ],
})
export class AppModule {}
