import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { apiResponse } from '@common';
import { TipoInmueble } from '@entities/tipo-inmueble.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TiposInmuebleService {
  constructor(
    @InjectRepository(TipoInmueble)
    private readonly tipoInmuebleRepository: Repository<TipoInmueble>,
  ) {}

  async findAllActive() {
    const tiposInmueble = await this.tipoInmuebleRepository.find({
      where: { activo: true },
      order: { nombre: 'ASC' },
    });

    return apiResponse(tiposInmueble);
  }
}
