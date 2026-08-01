import { Controller, Get } from '@nestjs/common';
import { Auth } from '@common';
import { TiposInmuebleService } from './tipos-inmueble.service';

@Controller('tipos-inmueble')
export class TiposInmuebleController {
  constructor(private readonly tiposInmuebleService: TiposInmuebleService) {}

  @Get()
  @Auth()
  async findAllActive() {
    return this.tiposInmuebleService.findAllActive();
  }
}
