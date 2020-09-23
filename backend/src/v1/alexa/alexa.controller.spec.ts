import { Test, TestingModule } from '@nestjs/testing';
import { AlexaController } from './alexa.controller';

describe('Alexa Controller', () => {
  let controller: AlexaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlexaController],
    }).compile();

    controller = module.get<AlexaController>(AlexaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
