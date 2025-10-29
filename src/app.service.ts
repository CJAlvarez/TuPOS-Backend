import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return new Error('Not Found');
  }
}
