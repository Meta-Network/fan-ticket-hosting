import {MigrationInterface, QueryRunner} from "typeorm";

export class First1627292632550 implements MigrationInterface {
    name = 'First1627292632550'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `account` (`id` int NOT NULL, `address` char(42) NOT NULL, `keystore` text NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `transaction` (`id` int NOT NULL AUTO_INCREMENT, `from` char(42) NOT NULL, `to` char(42) NOT NULL, `type` enum ('transfer', 'mint', 'approve') NOT NULL, `value` varchar(78) NOT NULL, `deadline` int NOT NULL, `v` int NOT NULL, `r` char(66) NOT NULL, `s` char(66) NOT NULL, `txHash` varchar(255) NOT NULL, `status` enum ('pending', 'sending', 'success', 'reverted') NOT NULL DEFAULT 'pending', `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `transaction`");
        await queryRunner.query("DROP TABLE `account`");
    }

}
