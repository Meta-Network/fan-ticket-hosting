import {MigrationInterface, QueryRunner} from "typeorm";

export class seperateInAndOutForIcTokenTx1628845404868 implements MigrationInterface {
    name = 'seperateInAndOutForIcTokenTx1628845404868'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `inter_chain_in_transaction` (`id` int NOT NULL AUTO_INCREMENT, `icTokenId` int NOT NULL, `tokenId` int NOT NULL, `from` char(42) NOT NULL, `to` char(42) NOT NULL, `value` varchar(78) NOT NULL, `deadline` int NOT NULL, `v` int NOT NULL, `r` char(66) NOT NULL, `s` char(66) NOT NULL, `txHash` varchar(255) NULL, `status` enum ('pending', 'sending', 'success', 'reverted') NOT NULL DEFAULT 'pending', `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `inter_chain_transaction` CHANGE `type` `type` enum ('mint') NOT NULL");
        await queryRunner.query("ALTER TABLE `inter_chain_in_transaction` ADD CONSTRAINT `FK_c051a1069850c94734286969495` FOREIGN KEY (`icTokenId`) REFERENCES `inter_chain_token`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `inter_chain_in_transaction` ADD CONSTRAINT `FK_e1a90c643dcf7f111d9b162e766` FOREIGN KEY (`tokenId`) REFERENCES `token`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `inter_chain_in_transaction` DROP FOREIGN KEY `FK_e1a90c643dcf7f111d9b162e766`");
        await queryRunner.query("ALTER TABLE `inter_chain_in_transaction` DROP FOREIGN KEY `FK_c051a1069850c94734286969495`");
        await queryRunner.query("ALTER TABLE `inter_chain_transaction` CHANGE `type` `type` enum ('burn', 'mint') NOT NULL");
        await queryRunner.query("DROP TABLE `inter_chain_in_transaction`");
    }

}
