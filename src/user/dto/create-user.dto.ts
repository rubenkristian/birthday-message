import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsTimezone } from "src/utils/timezone.validator";

export class CreateUserDto {
    @ApiProperty({
        type: String,
        description: 'user first name'
    })
    first_name: string;

    @ApiProperty({
        type: String,
        description: 'user last name'
    })
    last_name: string;

    @ApiProperty({
        type: String,
        description: 'user email'
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        type: String,
        description: 'user location'
    })
    location: string;

    @ApiProperty({
        type: Date,
        description: 'user birthday'
    })
    birthday: Date;
}
