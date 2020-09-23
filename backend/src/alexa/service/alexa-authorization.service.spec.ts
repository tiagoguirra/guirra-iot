import { Test, TestingModule } from '@nestjs/testing';
import { AlexaAuthorizationService } from './alexa-authorization.service';

describe('AlexaAuthorizationService', () => {
  let service: AlexaAuthorizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlexaAuthorizationService],
    }).compile();

    service = module.get<AlexaAuthorizationService>(AlexaAuthorizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
