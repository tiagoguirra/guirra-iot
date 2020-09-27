import { Test, TestingModule } from '@nestjs/testing';
import { DeviceHistoryService } from './device-history.service';

describe('DeviceHistoryService', () => {
  let service: DeviceHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeviceHistoryService],
    }).compile();

    service = module.get<DeviceHistoryService>(DeviceHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
