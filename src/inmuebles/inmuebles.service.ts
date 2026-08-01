import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { apiResponse, normalizePagination, paginatedResponse } from '@common';
import { Inmueble } from '@entities/inmueble.entity';
import { TipoInmueble } from '@entities/tipo-inmueble.entity';
import { Repository } from 'typeorm';
import { INMUEBLE_ESTADO_TRANSITIONS } from './constants';
import { CreateInmuebleDto } from './dto/create-inmueble.dto';
import { UpdateInmuebleEstadoDto } from './dto/update-inmueble-estado.dto';
import { UpdateInmuebleDto } from './dto/update-inmueble.dto';
import { InmuebleEstado } from './enums';
import { FindAllInmueblesQuery, InmueblesListFilters } from './interfaces';
import {
  applyInmuebleWhereConditions,
  buildInmuebleWhereConditions,
  normalizeBoolean,
  normalizeInmuebleEstado,
  normalizeInmuebleOrder,
  normalizeInmuebleOrderBy,
  normalizeNumber,
} from './utils';

@Injectable()
export class InmueblesService {
  constructor(
    @InjectRepository(Inmueble)
    private readonly inmuebleRepository: Repository<Inmueble>,
    @InjectRepository(TipoInmueble)
    private readonly tipoInmuebleRepository: Repository<TipoInmueble>,
  ) {}

  async create(userId: string, body: CreateInmuebleDto) {
    const tipoInmueble = await this.tipoInmuebleRepository.findOne({
      where: { id: body.tipoInmuebleId, activo: true },
    });

    if (!tipoInmueble) {
      throw new NotFoundException('Tipo de inmueble no encontrado');
    }

    const inmueble = this.inmuebleRepository.create({
      ...body,
      vendedorId: userId,
      estado: InmuebleEstado.DISPONIBLE,
    });
    const savedInmueble = await this.inmuebleRepository.save(inmueble);

    return apiResponse(savedInmueble);
  }

  async update(userId: string, id: string, body: UpdateInmuebleDto) {
    const inmueble = await this.inmuebleRepository.findOne({
      where: { id },
    });

    if (!inmueble) {
      throw new NotFoundException('Inmueble no encontrado');
    }

    if (inmueble.vendedorId !== userId) {
      throw new ForbiddenException('No puedes editar este inmueble');
    }

    if (inmueble.estado === InmuebleEstado.VENDIDO) {
      throw new ForbiddenException('No puedes editar un inmueble vendido');
    }

    if (body.tipoInmuebleId) {
      const tipoInmueble = await this.tipoInmuebleRepository.findOne({
        where: { id: body.tipoInmuebleId, activo: true },
      });

      if (!tipoInmueble) {
        throw new NotFoundException('Tipo de inmueble no encontrado');
      }
    }

    const updatedInmueble = await this.inmuebleRepository.save({
      ...inmueble,
      ...body,
    });

    return apiResponse(updatedInmueble);
  }

  async updateEstado(
    userId: string,
    id: string,
    body: UpdateInmuebleEstadoDto,
  ) {
    const inmueble = await this.inmuebleRepository.findOne({
      where: { id },
    });

    if (!inmueble) {
      throw new NotFoundException('Inmueble no encontrado');
    }

    if (inmueble.vendedorId !== userId) {
      throw new ForbiddenException('No puedes editar este inmueble');
    }

    const validNextEstados = INMUEBLE_ESTADO_TRANSITIONS[inmueble.estado];

    if (!validNextEstados.includes(body.estado)) {
      throw new ForbiddenException('Transicion de estado invalida');
    }

    const updatedInmueble = await this.inmuebleRepository.save({
      ...inmueble,
      estado: body.estado,
    });

    return apiResponse(updatedInmueble);
  }

  async findAll(userId: string, query: FindAllInmueblesQuery) {
    const pagination = normalizePagination(query.page, query.limit);
    const filters: InmueblesListFilters = {
      estado: normalizeInmuebleEstado(query.estado),
      tipoInmuebleId: query.tipoInmuebleId.trim() || undefined,
      precioMin: normalizeNumber(query.precioMin),
      precioMax: normalizeNumber(query.precioMax),
      search: query.search.trim() || undefined,
      soloMios: normalizeBoolean(query.soloMios),
      orderBy: normalizeInmuebleOrderBy(query.orderBy),
      order: normalizeInmuebleOrder(query.order),
    };

    const queryBuilder = this.inmuebleRepository
      .createQueryBuilder('inmueble')
      .leftJoinAndSelect('inmueble.tipoInmueble', 'tipoInmueble')
      .leftJoinAndSelect('inmueble.vendedor', 'vendedor')
      .skip(pagination.skip)
      .take(pagination.limit)
      .orderBy(
        `inmueble.${filters.orderBy.value}`,
        filters.order.value === 'ASC' ? 'ASC' : 'DESC',
      );

    applyInmuebleWhereConditions(
      queryBuilder,
      buildInmuebleWhereConditions(filters, userId),
    );

    const [inmuebles, total] = await queryBuilder.getManyAndCount();

    return apiResponse(
      paginatedResponse(inmuebles, total, pagination.page, pagination.limit),
    );
  }

  async findOne(id: string) {
    const inmueble = await this.inmuebleRepository.findOne({
      where: { id },
      relations: {
        tipoInmueble: true,
        vendedor: true,
      },
    });

    if (!inmueble) {
      throw new NotFoundException('Inmueble no encontrado');
    }

    return apiResponse(inmueble);
  }

  async remove(userId: string, id: string) {
    const inmueble = await this.inmuebleRepository.findOne({
      where: { id },
    });

    if (!inmueble) {
      throw new NotFoundException('Inmueble no encontrado');
    }

    if (inmueble.vendedorId !== userId) {
      throw new ForbiddenException('No puedes eliminar este inmueble');
    }

    await this.inmuebleRepository.softDelete(id);

    return apiResponse(true);
  }
}
