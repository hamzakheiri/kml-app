import { Module } from '@nestjs/common';
import { XlsxHandlerController } from './xlsx-handler.controller';
import { XlsxHandlerService } from './xlsx-handler.service';

@Module({
  controllers: [XlsxHandlerController],
  providers: [XlsxHandlerService]
})
export class XlsxHandlerModule {}
