import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddLastStatus1730423752587 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('users', new TableColumn({
            name: 'last_status',
            type: 'varchar'
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('users', 'last_status');
    }

}
