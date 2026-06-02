import { DELETE, GET as GET_BY_ID, PATCH } from '@/app/api/releases/[id]/route';
import { GET, POST } from '@/app/api/releases/route';
import { prisma } from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    release: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const release = {
  id: 'release-1',
  name: 'Test Release',
  date: new Date('2026-06-01T00:00:00.000Z'),
  additionalInfo: '',
  completedSteps: [],
  steps: {},
  createdAt: new Date('2026-05-01T00:00:00.000Z'),
  updatedAt: new Date('2026-05-01T00:00:00.000Z'),
};

const routeContext = { params: Promise.resolve({ id: release.id }) };

describe('Release API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should list releases', async () => {
    jest.mocked(prisma.release.findMany).mockResolvedValue([release]);

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toHaveLength(1);
    expect(body[0].id).toBe(release.id);
    expect(prisma.release.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
    });
  });

  it('should create a release', async () => {
    jest.mocked(prisma.release.create).mockResolvedValue(release);

    const req = new Request('http://localhost/api/releases', {
      method: 'POST',
      body: JSON.stringify({
        name: release.name,
        date: release.date.toISOString(),
        additionalInfo: release.additionalInfo,
      }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.id).toBe(release.id);
    expect(prisma.release.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          name: release.name,
          completedSteps: [],
        }),
      })
    );
  });

  it('should fetch the release', async () => {
    jest.mocked(prisma.release.findUnique).mockResolvedValue(release);

    const res = await GET_BY_ID(new Request('http://localhost/api/releases/release-1'), routeContext);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.name).toBe(release.name);
    expect(prisma.release.findUnique).toHaveBeenCalledWith({
      where: { id: release.id },
    });
  });

  it('should return 404 for a missing release', async () => {
    jest.mocked(prisma.release.findUnique).mockResolvedValue(null);

    const res = await GET_BY_ID(new Request('http://localhost/api/releases/missing'), routeContext);
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.error).toBe('Release not found');
  });

  it('should update the release steps', async () => {
    const updatedRelease = {
      ...release,
      completedSteps: ['Step 1'],
      additionalInfo: 'Updated info',
    };
    jest.mocked(prisma.release.update).mockResolvedValue(updatedRelease);

    const req = new Request('http://localhost/api/releases/release-1', {
      method: 'PATCH',
      body: JSON.stringify({
        completedSteps: updatedRelease.completedSteps,
        additionalInfo: updatedRelease.additionalInfo,
      }),
    });

    const res = await PATCH(req, routeContext);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.completedSteps).toContain('Step 1');
    expect(prisma.release.update).toHaveBeenCalledWith({
      where: { id: release.id },
      data: {
        completedSteps: updatedRelease.completedSteps,
        additionalInfo: updatedRelease.additionalInfo,
      },
    });
  });

  it('should delete the release', async () => {
    jest.mocked(prisma.release.delete).mockResolvedValue(release);

    const res = await DELETE(new Request('http://localhost/api/releases/release-1'), routeContext);

    expect(res.status).toBe(204);
    expect(prisma.release.delete).toHaveBeenCalledWith({
      where: { id: release.id },
    });
  });
});
