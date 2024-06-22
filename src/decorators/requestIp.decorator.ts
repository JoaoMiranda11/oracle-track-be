import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RequestIp = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.ip || request.connection.remoteAddress;
  },
);
