import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFnGetTransactions1752690430965 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION fn_get_transactions(p_id UUID DEFAULT NULL)
            RETURNS TABLE(id UUID, user_id UUID, amount TEXT, created_at TIMESTAMP, updated_at TIMESTAMP)
            AS $$
            BEGIN
                IF p_id IS NULL THEN
                RETURN QUERY
                SELECT
                    t.id,
                    t.user_id,
                    t.amount,
                    t.created_at,
                    t.updated_at
                FROM "transaction" t;
                ELSE
                RETURN QUERY
                SELECT
                    t.id,
                    t.user_id,
                    t.amount,
                    t.created_at,
                    t.updated_at
                FROM "transaction" t
                WHERE t.id = p_id;
                END IF;
            END;
            $$ LANGUAGE plpgsql;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP FUNCTION IF EXISTS fn_get_transactions(UUID)`);
    }

}
