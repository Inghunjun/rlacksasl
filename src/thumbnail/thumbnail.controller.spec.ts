import { Test, TestingModule } from '@nestjs/testing';
import { ThumbnailController } from './thumbnail.controller';
import { ThumbnailService } from './thumbnail.service';

describe('ThumbnailController', () => {
  let controller: ThumbnailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThumbnailController],
      providers: [ThumbnailService],
    }).compile();

    controller = module.get<ThumbnailController>(ThumbnailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
