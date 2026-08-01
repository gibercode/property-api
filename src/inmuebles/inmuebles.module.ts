import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from '@common';
import { JwtConfigModule } from '@config/jwt';
import { Inmueble } from '@entities/inmueble.entity';
import { InmueblesController } from './inmuebles.controller';
import { InmueblesService } from './inmuebles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Inmueble]), JwtConfigModule],
  controllers: [InmueblesController],
  providers: [InmueblesService, JwtAuthGuard],
})
export class InmueblesModule {}
