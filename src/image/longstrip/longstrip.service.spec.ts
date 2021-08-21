import { Test, TestingModule } from '@nestjs/testing';
import { LongstripService } from './longstrip.service';

describe('LongstripService', () => {
  let service: LongstripService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LongstripService],
    }).compile();

    service = module.get<LongstripService>(LongstripService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
