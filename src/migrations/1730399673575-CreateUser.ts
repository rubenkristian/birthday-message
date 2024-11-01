import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUser1730399673575 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'users',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment'
                    },
                    {
                        name: 'first_name',
                        type: 'varchar',
                        isNullable: false
                    },
                    {
                        name: 'last_name',
                        type: 'varchar',
                        isNullable: false
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        isUnique: true,
                        isNullable: false
                    },
                    {
                        name: 'birthday',
                        type: 'date',
                        isNullable: false
                    },
                    {
                        name: 'last_updated',
                        type: 'timestamp',
                        isNullable: true,
                        default: null
                    },
                    {
                        name: 'craeted_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP'
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        isNullable: true
                    }
                ]
            }),
            true
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users');
    }

}
