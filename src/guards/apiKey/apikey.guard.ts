import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'] as string;

    if (this.isValidApiKey(apiKey)) {
      return true;
    }

    throw new UnauthorizedException('Invalid API key');
  }

  private isValidApiKey(apiKey: string): boolean {
    const validApiKey = process.env.X_API_KEY;
    return apiKey === validApiKey;
  }
}
