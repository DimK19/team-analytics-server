import { Test, TestingModule } from '@nestjs/testing';
import { MonService } from './mon.service';

describe('MonService', () => {
  let service: MonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonService],
    }).compile();

    service = module.get<MonService>(MonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
