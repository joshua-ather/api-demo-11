import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1752690354140 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                "name" TEXT NOT NULL,
                "email" TEXT UNIQUE NOT NULL,
                "password" TEXT NOT NULL,
                "token" TEXT
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "user"`);
    }

}
