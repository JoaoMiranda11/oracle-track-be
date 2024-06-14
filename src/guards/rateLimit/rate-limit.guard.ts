// throttle.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { RateLimiterMemory } from 'rate-limiter-flexible';

@Injectable()
export class ThrottleGuard implements CanActivate {
  private rateLimiter = new RateLimiterMemory({
    points: 10,
    duration: 1,
  });

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip;

    try {
      await this.rateLimiter.consume(ip);
      return true;
    } catch (rejRes) {
      throw new Error('Too many requests');
    }
  }
}
