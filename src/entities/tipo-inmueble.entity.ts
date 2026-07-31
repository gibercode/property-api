import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Inmueble } from './inmueble.entity';

@Entity('tipo_inmueble')
export class TipoInmueble {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  codigo: string;

  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @OneToMany(() => Inmueble, (inmueble) => inmueble.tipoInmueble)
  inmuebles: Inmueble[];
}
