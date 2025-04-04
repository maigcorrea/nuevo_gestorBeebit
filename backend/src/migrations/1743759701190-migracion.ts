import { MigrationInterface, QueryRunner } from "typeorm";

export class Migracion1743759701190 implements MigrationInterface {
    name = 'Migracion1743759701190'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."task_priority_enum" AS ENUM('high', 'medium', 'low')`);
        await queryRunner.query(`CREATE TYPE "public"."task_status_enum" AS ENUM('pending', 'active', 'completed')`);
        await queryRunner.query(`CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(100) NOT NULL, "description" character varying(200) NOT NULL, "start_date" TIMESTAMP NOT NULL, "end_date" TIMESTAMP, "completed" boolean NOT NULL DEFAULT false, "priority" "public"."task_priority_enum" NOT NULL, "status" "public"."task_status_enum" NOT NULL, "project_id" uuid, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."project_status_enum" AS ENUM('pending', 'active', 'paused', 'completed')`);
        await queryRunner.query(`CREATE TABLE "project" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(100) NOT NULL, "description" character varying(200) NOT NULL, "start_date" date, "deadline" date, "last_update" date, "status" "public"."project_status_enum" NOT NULL DEFAULT 'active', CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."staff_type_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`CREATE TABLE "staff" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "email" character varying NOT NULL, "register_date" TIMESTAMP NOT NULL DEFAULT now(), "phone" character varying NOT NULL, "password" character varying NOT NULL, "type" "public"."staff_type_enum" NOT NULL DEFAULT 'user', "resetToken" character varying, "resetTokenExpiry" TIMESTAMP, "profileImage" character varying, CONSTRAINT "UQ_ac1e6b1644e89c72ed1e16d2da3" UNIQUE ("name"), CONSTRAINT "UQ_902985a964245652d5e3a0f5f6a" UNIQUE ("email"), CONSTRAINT "UQ_4d4956f0d921cf205e2c34e130b" UNIQUE ("phone"), CONSTRAINT "PK_e4ee98bb552756c180aec1e854a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "task_staff" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "id_task" uuid, "id_staff" uuid, CONSTRAINT "PK_e5b973a4aa5bfff0e267b8425b5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_1f53e7ffe94530f9e0221224d29" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_staff" ADD CONSTRAINT "FK_d0226d4bf72f01e361b673d3cda" FOREIGN KEY ("id_task") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_staff" ADD CONSTRAINT "FK_810c32100257d62cd70ae655b3c" FOREIGN KEY ("id_staff") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_staff" DROP CONSTRAINT "FK_810c32100257d62cd70ae655b3c"`);
        await queryRunner.query(`ALTER TABLE "task_staff" DROP CONSTRAINT "FK_d0226d4bf72f01e361b673d3cda"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_1f53e7ffe94530f9e0221224d29"`);
        await queryRunner.query(`DROP TABLE "task_staff"`);
        await queryRunner.query(`DROP TABLE "staff"`);
        await queryRunner.query(`DROP TYPE "public"."staff_type_enum"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`DROP TYPE "public"."project_status_enum"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TYPE "public"."task_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."task_priority_enum"`);
    }

}
