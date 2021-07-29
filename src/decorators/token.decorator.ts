import { BadRequestException } from "@nestjs/common";
import { Token } from "src/entities/Token";
import { TransactionStatus } from "src/types";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const OnlyPublishedToken = (_: unknown, _propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
        const [ token ] = args;
        if (!(token instanceof Token)) {
            throw new BadRequestException("Parameter for token is wrong. Please report to dev team.")
        }
        if (token.status !== TransactionStatus.SUCCESS) {
            throw new BadRequestException(`The token '${token.name}' was not issued at blockchain right now, please try again later.`)
        }
        return originalMethod.apply(this, args);
    }
};
