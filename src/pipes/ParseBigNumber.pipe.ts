import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';
import { BigNumber, BigNumberish } from 'ethers';

@Injectable()
export class ParseBigNumberPipe
  implements PipeTransform<any, BigNumber> {

  transform(_number: BigNumberish | any, metadata: ArgumentMetadata): BigNumber {
    try {
      return BigNumber.from(_number);
    } catch (error) {
      throw new BadRequestException(`Failed to parse '${metadata.data}' as BigNumber`);
    }
  }
}
