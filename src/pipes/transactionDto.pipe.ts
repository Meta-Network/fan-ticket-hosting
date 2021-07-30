import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { BigNumber, BigNumberish } from 'ethers';
import { utils } from 'ethers';
import { TransactionDto } from 'src/token/dto/TokenTransactionDto';

@Injectable()
export class CheckTransactionPipe
  implements PipeTransform<TransactionDto, TransactionDto> {
  getChecksumedAddress(address: string): string {
    try {
      return utils.getAddress(address);
    } catch (error) {
      throw new BadRequestException(
        'Your input was invalid, please check your `to` address.',
      );
    }
  }

  parseBigNumber(bnish: BigNumberish): BigNumber {
    try {
      return BigNumber.from(bnish);
    } catch (error) {
      throw new BadRequestException("Failed to parse the `value`, please try again");
    }
  }


  transform(body: TransactionDto, metadata: ArgumentMetadata): TransactionDto {
    const copiedBody = body;
    copiedBody.to = this.getChecksumedAddress(copiedBody.to);
    copiedBody.value = this.parseBigNumber(copiedBody.value)
    return copiedBody;
  }
}
