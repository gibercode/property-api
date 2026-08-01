import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PASSWORD_SALT_ROUNDS } from '@common';
import { Usuario } from '@entities/usuario.entity';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { apiResponse } from 'src/common/utils/api-response.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async register(body: RegisterUserDto) {
    const existingUser = await this.usuarioRepository.findOne({
      where: { email: body.email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya se encuentra registrado');
    }

    const hashedPassword = await bcrypt.hash(
      body.password,
      PASSWORD_SALT_ROUNDS,
    );

    const user = this.usuarioRepository.create({
      ...body,
      password: hashedPassword,
    });

    const savedUser = await this.usuarioRepository.save(user);
    const { password, ...userWithoutPassword } = savedUser;

    return apiResponse(userWithoutPassword);
  }

  async login({ email, password }: LoginUserDto) {
    const user = await this.usuarioRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('El usuario no existe');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const { password: _, ...userWithoutPassword } = user;

    return apiResponse(userWithoutPassword);
  }
}
