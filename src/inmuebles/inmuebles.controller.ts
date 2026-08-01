import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
  Req,
} from '@nestjs/common';
import { Auth, AuthenticatedRequest } from '@common';
import { InmueblesService } from './inmuebles.service';

@Controller('inmuebles')
export class InmueblesController {
  constructor(private readonly inmueblesService: InmueblesService) {}

  @Get()
  @Auth()
  async findAll(
    @Req() request: AuthenticatedRequest,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('estado', new DefaultValuePipe('')) estado: string,
    @Query('tipoInmuebleId', new DefaultValuePipe('')) tipoInmuebleId: string,
    @Query('precioMin', new DefaultValuePipe('')) precioMin: string,
    @Query('precioMax', new DefaultValuePipe('')) precioMax: string,
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('soloMios', new DefaultValuePipe('false')) soloMios: string,
    @Query('orderBy', new DefaultValuePipe('createdAt')) orderBy: string,
    @Query('order', new DefaultValuePipe('DESC')) order: string,
  ) {
    return this.inmueblesService.findAll(request.user, {
      page,
      limit,
      estado,
      tipoInmuebleId,
      precioMin,
      precioMax,
      search,
      soloMios,
      orderBy,
      order,
    });
  }
}
