import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFnUpsertTransaction1752690442529 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION fn_upsert_transaction(
                p_id UUID,
                p_user_id UUID,
                p_amount NUMERIC
            )
            RETURNS TABLE (
                out_id UUID,
                out_created_at TIMESTAMP,
                out_updated_at TIMESTAMP
            ) AS $$
            BEGIN
                IF p_id IS NULL THEN
                    RETURN QUERY
                    INSERT INTO "transaction" (user_id, amount)
                    VALUES (p_user_id, p_amount)
                    RETURNING id, created_at, updated_at;
                ELSE
                    RETURN QUERY
                    UPDATE "transaction"
                    SET amount = p_amount,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = p_id
                    RETURNING id, created_at, updated_at;
                END IF;
            END;
            $$ LANGUAGE plpgsql;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      DROP FUNCTION IF EXISTS fn_upsert_transaction(UUID, UUID, NUMERIC);
    `);
    }
}
