import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFnUpsertTransaction1752690442529 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION fn_upsert_transaction(
                p_id UUID,
                p_user_id UUID,
                p_amount TEXT
            )
            RETURNS UUID AS $$
            DECLARE
                v_new_id UUID;
            BEGIN
                IF p_id IS NULL THEN
                INSERT INTO "transaction" (user_id, amount)
                VALUES (p_user_id, p_amount)
                RETURNING id INTO v_new_id;
                ELSE
                UPDATE "transaction"
                SET amount = p_amount,
                    updated_at = CURRENT_TIMESTAMP
                WHERE "id" = p_id
                RETURNING id INTO v_new_id;
                END IF;

                RETURN v_new_id;
            END;
            $$ LANGUAGE plpgsql;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      DROP FUNCTION IF EXISTS fn_upsert_transaction(UUID, UUID, TEXT);
    `);
    }
}
