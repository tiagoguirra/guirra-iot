import { Test, TestingModule } from '@nestjs/testing';
import { AlexaResponseService } from './alexa-response.service';

describe('AlexaResponseService', () => {
  let service: AlexaResponseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlexaResponseService],
    }).compile();

    service = module.get<AlexaResponseService>(AlexaResponseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
