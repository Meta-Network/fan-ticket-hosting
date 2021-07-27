import {MigrationInterface, QueryRunner} from "typeorm";

export class allowNullForTxhash1627379465385 implements MigrationInterface {
    name = 'allowNullForTxhash1627379465385'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `token` CHANGE `txHash` `txHash` varchar(255) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `token` CHANGE `txHash` `txHash` varchar(255) NOT NULL");
    }

}
