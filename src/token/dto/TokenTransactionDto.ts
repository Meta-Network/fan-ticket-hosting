import { ApiProperty } from '@nestjs/swagger';

export class TransferDto {
  // @todo: remove this from prod
  @ApiProperty()
  from: number;

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

export class MintDto {
    @ApiProperty({
      description: 'Mint destination',
    })
    to: string;
  
    @ApiProperty({
      description: 'The amount to mint',
    })
    value: string;
  
    @ApiProperty({
      description: 'Password that unlocks the from wallet',
    })
    password: string;
  }
