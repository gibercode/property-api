import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from './usuario.entity';
import { TipoInmueble } from './tipo-inmueble.entity';

@Entity('inmueble')
export class Inmueble {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  direccion: string;

  @Column({ type: 'int' })
  precio: number;

  @Column({ type: 'int' })
  habitaciones: number;

  @Column({ type: 'int' })
  metrosCuadrados: number;

  @Column({ type: 'uuid', name: 'vendedorId' })
  vendedorId: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.inmuebles, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'vendedorId' })
  vendedor: Usuario;

  @Column({ type: 'uuid', name: 'tipoInmuebleId' })
  tipoInmuebleId: string;

  @ManyToOne(() => TipoInmueble, (tipo) => tipo.inmuebles, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'tipoInmuebleId' })
  tipoInmueble: TipoInmueble;
}
