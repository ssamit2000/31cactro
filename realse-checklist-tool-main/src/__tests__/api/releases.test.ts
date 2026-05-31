import request from 'supertest';
import { app } from '@/app'; // or your Next.js server if custom
import { prisma } from '@/lib/prisma';

describe('Release API', () => {
  let releaseId: string;

  it('should create a release', async () => {
    const res = await request('http://localhost:3000')
      .post('/api/releases')
      .send({ name: 'Test Release', date: new Date().toISOString(), additionalInfo: '' });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    releaseId = res.body.id;
  });

  it('should fetch the release', async () => {
    const res = await request('http://localhost:3000').get(`/api/releases/${releaseId}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Test Release');
  });

  it('should update the release steps', async () => {
    const res = await request('http://localhost:3000')
      .patch(`/api/releases/${releaseId}`)
      .send({ completedSteps: ['Step 1'], additionalInfo: 'Updated info' });

    expect(res.status).toBe(200);
    expect(res.body.completedSteps).toContain('Step 1');
  });

  it('should delete the release', async () => {
    const res = await request('http://localhost:3000').delete(`/api/releases/${releaseId}`);
    expect(res.status).toBe(204);
  });
});