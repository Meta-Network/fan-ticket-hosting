import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenamingToOutTransaction1627378162453
  implements MigrationInterface {
  name = 'RenamingToOutTransaction1627378162453';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `transaction`');
    await queryRunner.query(
      "CREATE TABLE `out_transaction` (`id` int NOT NULL AUTO_INCREMENT, `tokenId` int NOT NULL, `to` char(42) NOT NULL, `type` enum ('transfer', 'mint', 'approve') NOT NULL, `value` varchar(78) NOT NULL, `deadline` int NOT NULL, `v` int NOT NULL, `r` char(66) NOT NULL, `s` char(66) NOT NULL, `txHash` varchar(255) NOT NULL, `status` enum ('pending', 'sending', 'success', 'reverted') NOT NULL DEFAULT 'pending', `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `fromId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      'ALTER TABLE `out_transaction` ADD CONSTRAINT `FK_7e818c3a785f505fe70a4310193` FOREIGN KEY (`tokenId`) REFERENCES `token`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `out_transaction` ADD CONSTRAINT `FK_f483f8e833352c398ea41cc966b` FOREIGN KEY (`fromId`) REFERENCES `account`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `out_transaction` DROP FOREIGN KEY `FK_f483f8e833352c398ea41cc966b`',
    );
    await queryRunner.query(
      'ALTER TABLE `out_transaction` DROP FOREIGN KEY `FK_7e818c3a785f505fe70a4310193`',
    );
    await queryRunner.query('DROP TABLE `out_transaction`');
    await queryRunner.query(
      "CREATE TABLE `transaction` (`id` int NOT NULL AUTO_INCREMENT, `from` char(42) NOT NULL, `to` char(42) NOT NULL, `type` enum ('transfer', 'mint', 'approve') NOT NULL, `value` varchar(78) NOT NULL, `deadline` int NOT NULL, `v` int NOT NULL, `r` char(66) NOT NULL, `s` char(66) NOT NULL, `txHash` varchar(255) NOT NULL, `status` enum ('pending', 'sending', 'success', 'reverted') NOT NULL DEFAULT 'pending', `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
  }
}
