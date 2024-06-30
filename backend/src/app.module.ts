import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { XlsxHandlerModule } from './xlsx-handler/xlsx-handler.module';

@Module({
  imports: [XlsxHandlerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
