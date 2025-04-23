import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';

describe('TaskStaffController (e2e) - findTasksDueTomorrow', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/task-staff/vencen-manana (GET) should return tasks due tomorrow', async () => {
    const response = await request(app.getHttpServer())
      .get('/task-staff/vencen-manana')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    if (response.body.length > 0) {
      const item = response.body[0];
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('deadline');
      expect(item).toHaveProperty('email');
    }
  });
});
