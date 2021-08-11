import {MigrationInterface, QueryRunner} from "typeorm";

export class extendRelatedTx1628674470729 implements MigrationInterface {
    name = 'extendRelatedTx1628674470729'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `inter_chain_transaction` ADD `relatedTxId` int NULL");
        await queryRunner.query("ALTER TABLE `inter_chain_transaction` ADD UNIQUE INDEX `IDX_edcabe3e5549cb8a1b8a171230` (`relatedTxId`)");
        await queryRunner.query("CREATE UNIQUE INDEX `REL_edcabe3e5549cb8a1b8a171230` ON `inter_chain_transaction` (`relatedTxId`)");
        await queryRunner.query("ALTER TABLE `inter_chain_transaction` ADD CONSTRAINT `FK_edcabe3e5549cb8a1b8a171230a` FOREIGN KEY (`relatedTxId`) REFERENCES `out_transaction`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `inter_chain_transaction` DROP FOREIGN KEY `FK_edcabe3e5549cb8a1b8a171230a`");
        await queryRunner.query("DROP INDEX `REL_edcabe3e5549cb8a1b8a171230` ON `inter_chain_transaction`");
        await queryRunner.query("ALTER TABLE `inter_chain_transaction` DROP INDEX `IDX_edcabe3e5549cb8a1b8a171230`");
        await queryRunner.query("ALTER TABLE `inter_chain_transaction` DROP COLUMN `relatedTxId`");
    }

}
