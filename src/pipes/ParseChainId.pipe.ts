import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
  NotFoundException,
} from '@nestjs/common';
import { BigNumber } from 'ethers';
import { ChainId } from 'src/constant';
import { providers } from 'src/constant/providers';

@Injectable()
export class ParseChainIdPipe
  implements PipeTransform<string, ChainId> {

  transform(_number: string, metadata: ArgumentMetadata): ChainId {
    let parsedChainIdNumber: ChainId;

    try {
      parsedChainIdNumber = BigNumber.from(_number).toNumber()
    } catch (error) {
      throw new BadRequestException(`Failed to parse '${metadata.data}' as ChainId`);
    }

    const provider = providers[parsedChainIdNumber]
    if (!provider) {
      throw new NotFoundException(`ParseChainIdPipe::Error: Unsupported network id ${parsedChainIdNumber}`);
    }
    return parsedChainIdNumber as ChainId
  }
}
