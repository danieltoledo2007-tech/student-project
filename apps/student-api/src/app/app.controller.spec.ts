import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();
  });

  describe('getStudents', () => {
    it('should return an array', () => {
      const appController = app.get<AppController>(AppController);
      expect(Array.isArray(appController.getStudents())).toBe(true);
    });
  });
});
