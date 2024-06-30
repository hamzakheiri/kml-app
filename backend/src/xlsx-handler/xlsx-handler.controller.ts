import { Controller, Get, Post, UploadedFile, UseInterceptors, Res, Body } from '@nestjs/common';
import { XlsxHandlerService } from './xlsx-handler.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('xlsx-handler')
export class XlsxHandlerController {
  constructor(
    private xlsxService :XlsxHandlerService
  ) {}

  @Get('test')
  testing(){
    return this.xlsxService.test();
  }
  @Post('createReport')
  @UseInterceptors(FileInterceptor('file'))
  async createReport(@UploadedFile() file: Express.Multer.File, @Res() res: Response, @Body() body: any) {
    console.log('file', file, 'body:', body);
    // this.xlsxService.createXlsxRes(file, body);
    const buffer = await this.xlsxService.createExcelJs(file, body);
    console.log(buffer.byteLength);
    // res.setHeader('Content-Disposition', 'attachment; filename="data.xlsx"');
    // res.setHeader('Content-Length', buffer.length);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  }
}
