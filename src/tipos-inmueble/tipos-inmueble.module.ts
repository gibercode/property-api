import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from '@common';
import { JwtConfigModule } from '@config/jwt';
import { TipoInmueble } from '@entities/tipo-inmueble.entity';
import { TiposInmuebleController } from './tipos-inmueble.controller';
import { TiposInmuebleService } from './tipos-inmueble.service';

@Module({
  imports: [TypeOrmModule.forFeature([TipoInmueble]), JwtConfigModule],
  controllers: [TiposInmuebleController],
  providers: [TiposInmuebleService, JwtAuthGuard],
})
export class TiposInmuebleModule {}
