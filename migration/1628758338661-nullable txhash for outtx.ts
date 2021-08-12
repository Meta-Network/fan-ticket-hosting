import {MigrationInterface, QueryRunner} from "typeorm";

export class nullableTxhashForOuttx1628758338661 implements MigrationInterface {
    name = 'nullableTxhashForOuttx1628758338661'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_edcabe3e5549cb8a1b8a171230` ON `inter_chain_transaction`");
        await queryRunner.query("ALTER TABLE `out_transaction` CHANGE `txHash` `txHash` varchar(255) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `out_transaction` CHANGE `txHash` `txHash` varchar(255) NOT NULL");
        await queryRunner.query("CREATE UNIQUE INDEX `IDX_edcabe3e5549cb8a1b8a171230` ON `inter_chain_transaction` (`relatedTxId`)");
    }

}
