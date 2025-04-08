import { MigrationInterface, QueryRunner } from "typeorm";

export class Migracion1744110362586 implements MigrationInterface {
    name = 'Migracion1744110362586'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "subject" character varying NOT NULL, "text" text NOT NULL, "sentAt" TIMESTAMP NOT NULL DEFAULT now(), "senderId" uuid, "receiverId" uuid, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce" FOREIGN KEY ("senderId") REFERENCES "staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_acf951a58e3b9611dd96ce89042" FOREIGN KEY ("receiverId") REFERENCES "staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_acf951a58e3b9611dd96ce89042"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce"`);
        await queryRunner.query(`DROP TABLE "messages"`);
    }

}
