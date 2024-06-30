import { Test, TestingModule } from '@nestjs/testing';
import { XlsxHandlerService } from './xlsx-handler.service';

describe('XlsxHandlerService', () => {
  let service: XlsxHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [XlsxHandlerService],
    }).compile();

    service = module.get<XlsxHandlerService>(XlsxHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
