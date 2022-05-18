import { Test, TestingModule } from '@nestjs/testing';
import { MonController } from './mon.controller';

describe('MonController', () => {
  let controller: MonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonController],
    }).compile();

    controller = module.get<MonController>(MonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
