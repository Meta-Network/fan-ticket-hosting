import {MigrationInterface, QueryRunner} from "typeorm";

export class basicInterchainEntities1628495493857 implements MigrationInterface {
    name = 'basicInterchainEntities1628495493857'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `inter_chain_transaction` (`id` int NOT NULL AUTO_INCREMENT, `tokenId` int NOT NULL, `to` char(42) NOT NULL, `type` enum ('burn', 'mint') NOT NULL, `value` varchar(78) NOT NULL, `deadline` int NOT NULL, `v` int NOT NULL, `r` char(66) NOT NULL, `s` char(66) NOT NULL, `txHash` varchar(255) NOT NULL, `status` enum ('pending', 'sending', 'success', 'reverted') NOT NULL DEFAULT 'pending', `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `fromId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `inter_chain_token` (`id` int NOT NULL AUTO_INCREMENT, `originId` int NOT NULL, `chainId` int NOT NULL, `address` char(42) NOT NULL, `v` int NOT NULL, `r` char(66) NOT NULL, `s` char(66) NOT NULL, `txHash` varchar(255) NULL, `status` enum ('pending', 'sending', 'success', 'reverted') NOT NULL DEFAULT 'pending', `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `inter_chain_transaction` ADD CONSTRAINT `FK_cc0570f88c572a8cbe18ed16ce2` FOREIGN KEY (`tokenId`) REFERENCES `inter_chain_token`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `inter_chain_transaction` ADD CONSTRAINT `FK_525e30e520dd922637ec31595aa` FOREIGN KEY (`fromId`) REFERENCES `account`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `inter_chain_token` ADD CONSTRAINT `FK_e093098e68ff7d0b0ac3e299ff6` FOREIGN KEY (`originId`) REFERENCES `token`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `inter_chain_token` DROP FOREIGN KEY `FK_e093098e68ff7d0b0ac3e299ff6`");
        await queryRunner.query("ALTER TABLE `inter_chain_transaction` DROP FOREIGN KEY `FK_525e30e520dd922637ec31595aa`");
        await queryRunner.query("ALTER TABLE `inter_chain_transaction` DROP FOREIGN KEY `FK_cc0570f88c572a8cbe18ed16ce2`");
        await queryRunner.query("DROP TABLE `inter_chain_token`");
        await queryRunner.query("DROP TABLE `inter_chain_transaction`");
    }

}
