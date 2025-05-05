import { MigrationInterface, QueryRunner } from "typeorm";

export class AddClockifyUserIdColumn1746429100949 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          ALTER TABLE "staff"
          ADD COLUMN "clockifyUserId" varchar
        `);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          ALTER TABLE "staff"
          DROP COLUMN "clockifyUserId"
        `);
      }

}
