import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '🛒 Tiendazo API - Store Management Platform';
  }
}
