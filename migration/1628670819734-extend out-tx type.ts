import {MigrationInterface, QueryRunner} from "typeorm";

export class extendOutTxType1628670819734 implements MigrationInterface {
    name = 'extendOutTxType1628670819734'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `out_transaction` CHANGE `type` `type` enum ('transfer', 'mint', 'approve', 'ic_deposit', 'ic_withdraw') NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `out_transaction` CHANGE `type` `type` enum ('transfer', 'mint', 'approve') NOT NULL");
    }

}
