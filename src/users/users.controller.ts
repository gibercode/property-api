import {
  Body,
  Controller,
  Delete,
  DefaultValuePipe,
  Get,
  Param,
  Patch,
  ParseIntPipe,
  Query,
  Req,
} from '@nestjs/common';
import { Auth, AuthenticatedRequest } from '@common';
import { UpdateMeDto } from './dto/update-me.dto';
import { UsersService } from './users.service';

@Controller('usuarios')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Auth()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('orderBy', new DefaultValuePipe('nombre')) orderBy: string,
    @Query('order', new DefaultValuePipe('ASC')) order: string,
  ) {
    return this.usersService.findAll(page, limit, search, orderBy, order);
  }

  @Patch('me')
  @Auth()
  async updateMe(
    @Req() request: AuthenticatedRequest,
    @Body() updateMeDto: UpdateMeDto,
  ) {
    return this.usersService.updateMe(request.user, updateMeDto);
  }

  @Delete('me')
  @Auth()
  async deactivateMe(@Req() request: AuthenticatedRequest) {
    return this.usersService.deactivateMe(request.user);
  }

  @Get(':id')
  @Auth()
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
