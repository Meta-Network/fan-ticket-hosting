import { ApiProperty } from '@nestjs/swagger';

export class TransactionDto {
  @ApiProperty({
    description: 'Transfer destination',
  })
  to: string;

  @ApiProperty({
    description: 'The amount to transfer',
  })
  value: string;

  @ApiProperty({
    description: 'Password that unlocks the from wallet',
  })
  password: string;
}
