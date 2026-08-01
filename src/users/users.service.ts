import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { apiResponse, normalizePagination, paginatedResponse } from '@common';
import { Usuario } from '@entities/usuario.entity';
import { FindOptionsOrder, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { UpdateMeDto } from './dto/update-me.dto';
import { UsersListFilters } from './interfaces';
import { normalizeUserOrder, normalizeUserOrderBy } from './utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async findAll(
    page: number,
    limit: number,
    search: string,
    orderBy: string,
    order: string,
  ) {
    const pagination = normalizePagination(page, limit);
    const filters: UsersListFilters = {
      search: search.trim(),
      orderBy: normalizeUserOrderBy(orderBy),
      order: normalizeUserOrder(order),
    };
    const where: FindOptionsWhere<Usuario> = filters.search
      ? { nombre: ILike(`%${filters.search}%`) }
      : {};
    const orderOptions: FindOptionsOrder<Usuario> = {
      [filters.orderBy.value]: filters.order.value,
    };

    const [users, total] = await this.usuarioRepository.findAndCount({
      where,
      skip: pagination.skip,
      take: pagination.limit,
      order: orderOptions,
    });

    return apiResponse(
      paginatedResponse(users, total, pagination.page, pagination.limit),
    );
  }

  async findOne(id: string) {
    const user = await this.usuarioRepository.findOne({
      select: {
        nombre: true,
        email: true,
        activo: true,
      },
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return apiResponse(user);
  }

  async updateMe(userId: string, body: UpdateMeDto) {
    const user = await this.usuarioRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no autorizado');
    }

    if (body.email && body.email !== user.email) {
      const existingUser = await this.usuarioRepository.findOne({
        where: { email: body.email },
      });

      if (existingUser) {
        throw new ConflictException('El email ya se encuentra registrado');
      }
    }

    const updatedUser = await this.usuarioRepository.save({
      ...user,
      ...body,
    });
    const { password, id, ...userWithoutPassword } = updatedUser;

    return apiResponse(userWithoutPassword);
  }

  async deactivateMe(userId: string) {
    const user = await this.usuarioRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no autorizado');
    }

    await this.usuarioRepository.update(userId, { activo: false });
    await this.usuarioRepository.softDelete(userId);

    return apiResponse(true);
  }
}
