import { createParamDecorator } from '@nestjs/common';

export const CurrentUserId = createParamDecorator(
  (data, req) => req.args.find((e) => 'user' in e).user,
);
