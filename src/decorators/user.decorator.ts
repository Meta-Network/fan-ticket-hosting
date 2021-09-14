import { createParamDecorator } from '@nestjs/common';

/**
 * extract payload from JWT
 */
export const CurrentUserId = createParamDecorator(
  (data, req) => req.args.find((e) => 'user' in e).user,
);
