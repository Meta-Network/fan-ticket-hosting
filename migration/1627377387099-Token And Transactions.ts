import {MigrationInterface, QueryRunner} from "typeorm";

export class TokenAndTransactions1627377387099 implements MigrationInterface {
    name = 'TokenAndTransactions1627377387099'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `transaction` ADD `tokenId` int NOT NULL");
        await queryRunner.query("ALTER TABLE `transaction` ADD CONSTRAINT `FK_341e723068f21901fc3a160b8fa` FOREIGN KEY (`tokenId`) REFERENCES `token`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `transaction` DROP FOREIGN KEY `FK_341e723068f21901fc3a160b8fa`");
        await queryRunner.query("ALTER TABLE `transaction` DROP COLUMN `tokenId`");
    }

}
