import {MigrationInterface, QueryRunner} from "typeorm";

export class AddNonce1627292944594 implements MigrationInterface {
    name = 'AddNonce1627292944594'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `account` ADD `nonce` int NOT NULL DEFAULT '0'");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `account` DROP COLUMN `nonce`");
    }

}
