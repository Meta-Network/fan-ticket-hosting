import { ApiProperty } from "@nestjs/swagger";


export class CreateWalletDto {
    @ApiProperty()
    password: string;
}