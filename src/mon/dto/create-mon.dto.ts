import { IsString, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateMonDto {
    @IsString()
    @IsNotEmpty()
    @Transform(x => x.value.toLowerCase())
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    @Transform(x => x.value.toLowerCase())
    readonly type_1: string;

    @IsString()
    @IsNotEmpty()
    @Transform(x => x.value.toLowerCase())
    readonly type_2: string;

    @IsNotEmpty()
    readonly speed: number;
}
