import { ApiProperty } from '@nestjs/swagger';

export class CreateTokenDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  symbol: string;

  @ApiProperty()
  initialSupply: string;
}
