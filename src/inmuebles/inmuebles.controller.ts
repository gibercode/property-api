import {
  Body,
  Controller,
  Delete,
  DefaultValuePipe,
  Get,
  Param,
  Patch,
  ParseIntPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Auth, AuthenticatedRequest } from '@common';
import { CreateInmuebleDto } from './dto/create-inmueble.dto';
import { UpdateInmuebleEstadoDto } from './dto/update-inmueble-estado.dto';
import { UpdateInmuebleDto } from './dto/update-inmueble.dto';
import { InmueblesService } from './inmuebles.service';

@Controller('inmuebles')
export class InmueblesController {
  constructor(private readonly inmueblesService: InmueblesService) {}

  @Post()
  @Auth()
  async create(
    @Req() request: AuthenticatedRequest,
    @Body() createInmuebleDto: CreateInmuebleDto,
  ) {
    return this.inmueblesService.create(request.user, createInmuebleDto);
  }

  @Patch(':id')
  @Auth()
  async update(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateInmuebleDto: UpdateInmuebleDto,
  ) {
    return this.inmueblesService.update(request.user, id, updateInmuebleDto);
  }

  @Patch(':id/estado')
  @Auth()
  async updateEstado(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateInmuebleEstadoDto: UpdateInmuebleEstadoDto,
  ) {
    return this.inmueblesService.updateEstado(
      request.user,
      id,
      updateInmuebleEstadoDto,
    );
  }

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

  @Get(':id')
  @Auth()
  async findOne(@Param('id') id: string) {
    return this.inmueblesService.findOne(id);
  }

  @Delete(':id')
  @Auth()
  async remove(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.inmueblesService.remove(request.user, id);
  }
}
