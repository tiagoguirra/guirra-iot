import { Test, TestingModule } from '@nestjs/testing';
import { AlexaEventService } from './alexa-event.service';

describe('AlexaEventService', () => {
  let service: AlexaEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlexaEventService],
    }).compile();

    service = module.get<AlexaEventService>(AlexaEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
