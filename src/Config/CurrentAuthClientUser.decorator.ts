import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const CurrentAuthClientUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();


  if (!request.user) {
    throw new UnauthorizedException();
  }
  return request.user;
});
