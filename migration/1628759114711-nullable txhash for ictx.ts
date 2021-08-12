import {MigrationInterface, QueryRunner} from "typeorm";

export class nullableTxhashForIctx1628759114711 implements MigrationInterface {
    name = 'nullableTxhashForIctx1628759114711'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `inter_chain_transaction` CHANGE `txHash` `txHash` varchar(255) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `inter_chain_transaction` CHANGE `txHash` `txHash` varchar(255) NOT NULL");
    }

}
