import { ApiProperty } from '@nestjs/swagger';
import { BigNumberish } from 'ethers';

export class GetICTokenDto {
  @ApiProperty({
    description: 'InterChain token destination',
  })
  to: string;

  @ApiProperty({
    description: 'The amount to transfer',
    type: 'string'
  })
  value: BigNumberish;

  @ApiProperty({
    description: 'Password that unlocks the from wallet',
  })
  password: string;
}