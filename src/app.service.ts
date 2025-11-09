import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '🛍️ Prisma Commerce API - Store Management Platform';
  }
}
