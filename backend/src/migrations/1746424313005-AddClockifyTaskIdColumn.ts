import { MigrationInterface, QueryRunner } from "typeorm";

export class AddClockifyTaskIdColumn1746424313005 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          ALTER TABLE "task"
          ADD COLUMN "clockifyTaskId" varchar
        `);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          ALTER TABLE "task"
          DROP COLUMN "clockifyTaskId"
        `);
      }

}
