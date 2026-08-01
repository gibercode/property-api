import { MigrationInterface, QueryRunner } from 'typeorm';
import { TIPOS_INMUEBLE_SEED } from '../seeds';

export class CreateBaseSchema1720000000000 implements MigrationInterface {
  name = 'CreateBaseSchema1720000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(`
      CREATE TYPE "inmueble_estado_enum" AS ENUM (
        'DISPONIBLE',
        'RESERVADO',
        'VENDIDO'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "usuario" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "nombre" varchar(150) NOT NULL,
        "email" varchar(255) NOT NULL,
        "password" varchar(255) NOT NULL,
        "activo" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP NULL,
        CONSTRAINT "UQ_usuario_email" UNIQUE ("email"),
        CONSTRAINT "PK_usuario_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "tipo_inmueble" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "codigo" varchar(50) NOT NULL,
        "nombre" varchar(150) NOT NULL,
        "activo" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP NULL,
        CONSTRAINT "UQ_tipo_inmueble_codigo" UNIQUE ("codigo"),
        CONSTRAINT "PK_tipo_inmueble_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "inmueble" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "direccion" varchar(255) NOT NULL,
        "precio" int NOT NULL,
        "habitaciones" int NOT NULL,
        "metrosCuadrados" int NOT NULL,
        "estado" "inmueble_estado_enum" NOT NULL DEFAULT 'DISPONIBLE',
        "vendedorId" uuid NOT NULL,
        "tipoInmuebleId" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP NULL,
        CONSTRAINT "PK_inmueble_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_inmueble_vendedor"
          FOREIGN KEY ("vendedorId")
          REFERENCES "usuario"("id")
          ON DELETE RESTRICT
          ON UPDATE NO ACTION,
        CONSTRAINT "FK_inmueble_tipo_inmueble"
          FOREIGN KEY ("tipoInmuebleId")
          REFERENCES "tipo_inmueble"("id")
          ON DELETE RESTRICT
          ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_inmueble_estado" ON "inmueble" ("estado")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_inmueble_tipo_inmueble_id"
      ON "inmueble" ("tipoInmuebleId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_inmueble_vendedor_id" ON "inmueble" ("vendedorId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_inmueble_precio" ON "inmueble" ("precio")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_inmueble_created_at" ON "inmueble" ("createdAt")
    `);

    for (const tipoInmueble of TIPOS_INMUEBLE_SEED) {
      await queryRunner.query(
        `
          INSERT INTO "tipo_inmueble" ("codigo", "nombre", "activo")
          VALUES ($1, $2, true)
        `,
        [tipoInmueble.codigo, tipoInmueble.nombre],
      );
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_inmueble_created_at"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_inmueble_precio"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_inmueble_vendedor_id"`);
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_inmueble_tipo_inmueble_id"
    `);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_inmueble_estado"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "inmueble"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tipo_inmueble"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "usuario"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "inmueble_estado_enum"`);
  }
}
