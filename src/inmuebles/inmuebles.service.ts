import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { apiResponse, normalizePagination, paginatedResponse } from '@common';
import { Inmueble } from '@entities/inmueble.entity';
import { Repository } from 'typeorm';
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
  ) {}

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
}
