import { MigrationInterface, QueryRunner } from "typeorm";

export class migrations1675177184193 implements MigrationInterface {
    name = 'migrations1675177184193'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mathangbienthe_giatribienthe" DROP CONSTRAINT "FK_251aece278837ef0cf2600a1d77"`);
        await queryRunner.query(`ALTER TABLE "mathangbienthe_giatribienthe" DROP CONSTRAINT "FK_295a609d0bf6196f1ad2e9a1f35"`);
        await queryRunner.query(`ALTER TABLE "giamgiadonhang" ALTER COLUMN "batdau" SET DEFAULT '"2023-01-31T14:59:45.995Z"'`);
        await queryRunner.query(`ALTER TABLE "mathangbienthe_giatribienthe" ADD CONSTRAINT "FK_251aece278837ef0cf2600a1d77" FOREIGN KEY ("giatribientheMagiatribienthe") REFERENCES "giatribienthe"("magiatribienthe") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "mathangbienthe_giatribienthe" ADD CONSTRAINT "FK_295a609d0bf6196f1ad2e9a1f35" FOREIGN KEY ("mathangbientheMahangbienthe") REFERENCES "mathangbienthe"("mahangbienthe") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mathangbienthe_giatribienthe" DROP CONSTRAINT "FK_295a609d0bf6196f1ad2e9a1f35"`);
        await queryRunner.query(`ALTER TABLE "mathangbienthe_giatribienthe" DROP CONSTRAINT "FK_251aece278837ef0cf2600a1d77"`);
        await queryRunner.query(`ALTER TABLE "giamgiadonhang" ALTER COLUMN "batdau" SET DEFAULT '2023-01-31 11:06:59.644'`);
        await queryRunner.query(`ALTER TABLE "mathangbienthe_giatribienthe" ADD CONSTRAINT "FK_295a609d0bf6196f1ad2e9a1f35" FOREIGN KEY ("mathangbientheMahangbienthe") REFERENCES "mathangbienthe"("mahangbienthe") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mathangbienthe_giatribienthe" ADD CONSTRAINT "FK_251aece278837ef0cf2600a1d77" FOREIGN KEY ("giatribientheMagiatribienthe") REFERENCES "giatribienthe"("magiatribienthe") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
