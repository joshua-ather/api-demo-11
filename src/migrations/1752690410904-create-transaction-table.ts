import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTransactionTable1752690410904 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "transaction" (
                "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                "user_id" UUID REFERENCES "user"("id") ON DELETE CASCADE,
                "amount" TEXT NOT NULL,
                "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "transaction"`);
    }

}
