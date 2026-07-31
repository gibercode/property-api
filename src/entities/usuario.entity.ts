import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Inmueble } from './inmueble.entity';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @OneToMany(() => Inmueble, (inmueble) => inmueble.vendedor)
  inmuebles: Inmueble[];
}
