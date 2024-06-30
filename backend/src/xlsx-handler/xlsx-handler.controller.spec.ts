import { Test, TestingModule } from '@nestjs/testing';
import { XlsxHandlerController } from './xlsx-handler.controller';

describe('XlsxHandlerController', () => {
  let controller: XlsxHandlerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [XlsxHandlerController],
    }).compile();

    controller = module.get<XlsxHandlerController>(XlsxHandlerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
