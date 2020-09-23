import { Test, TestingModule } from '@nestjs/testing';
import { AlexaControllerService } from './alexa-controller.service';

describe('AlexaControllerService', () => {
  let service: AlexaControllerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlexaControllerService],
    }).compile();

    service = module.get<AlexaControllerService>(AlexaControllerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
