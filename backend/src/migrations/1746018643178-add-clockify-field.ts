import { MigrationInterface, QueryRunner } from "typeorm";

export class AddClockifyFieldToProject1714475340000 implements MigrationInterface {
  name = 'AddClockifyFieldToProject1714475340000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "project"
      ADD COLUMN "clockifyProjectId" VARCHAR;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "project"
      DROP COLUMN "clockifyProjectId";
    `);
  }
}