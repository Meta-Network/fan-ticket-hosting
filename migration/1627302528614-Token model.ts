import {MigrationInterface, QueryRunner} from "typeorm";

export class TokenModel1627302528614 implements MigrationInterface {
    name = 'TokenModel1627302528614'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `token` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `symbol` varchar(255) NOT NULL, `totalSupply` varchar(255) NOT NULL, `address` char(42) NOT NULL, `v` int NOT NULL, `r` char(66) NOT NULL, `s` char(66) NOT NULL, `txHash` varchar(255) NOT NULL, `status` enum ('pending', 'sending', 'success', 'reverted') NOT NULL DEFAULT 'pending', `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `ownerId` int NULL, UNIQUE INDEX `REL_d6f364e68fe0ddc4b826be7c27` (`ownerId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `token` ADD CONSTRAINT `FK_d6f364e68fe0ddc4b826be7c27f` FOREIGN KEY (`ownerId`) REFERENCES `account`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `token` DROP FOREIGN KEY `FK_d6f364e68fe0ddc4b826be7c27f`");
        await queryRunner.query("DROP INDEX `REL_d6f364e68fe0ddc4b826be7c27` ON `token`");
        await queryRunner.query("DROP TABLE `token`");
    }

}
