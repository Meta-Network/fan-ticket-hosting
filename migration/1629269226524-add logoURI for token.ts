import {MigrationInterface, QueryRunner} from "typeorm";

export class addLogoURIForToken1629269226524 implements MigrationInterface {
    name = 'addLogoURIForToken1629269226524'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `token` ADD `logoURI` varchar(255) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `token` DROP COLUMN `logoURI`");
    }

}
