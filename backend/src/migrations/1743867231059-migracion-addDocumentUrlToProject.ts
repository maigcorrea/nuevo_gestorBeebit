import { MigrationInterface, QueryRunner } from "typeorm";

export class MigracionAddDocumentUrlToProject1743867231059 implements MigrationInterface {
    name = 'MigracionAddDocumentUrlToProject1743867231059'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" ADD "document_url" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "document_url"`);
    }

}
