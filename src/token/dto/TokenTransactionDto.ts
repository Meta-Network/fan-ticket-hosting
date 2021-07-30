import { ApiProperty } from '@nestjs/swagger';
import { BigNumberish } from 'ethers';

export class TransactionDto {
  @ApiProperty({
    description: 'Transfer destination',
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
