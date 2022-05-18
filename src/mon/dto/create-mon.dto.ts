import { IsString, IsNotEmpty } from 'class-validator';

export class CreateMonDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly type_1: string;

    @IsString()
    @IsNotEmpty()
    readonly type_2: string;

    @IsNotEmpty()
    readonly speed: number;
}
