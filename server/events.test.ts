import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { appRouter } from './routers';
import type { TrpcContext } from './_core/context';

type AuthenticatedUser = NonNullable<TrpcContext['user']>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: 'https',
      headers: {},
    } as TrpcContext['req'],
    res: {
      clearCookie: () => {},
    } as TrpcContext['res'],
  };
}

describe('Events API', () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    const ctx = createPublicContext();
    caller = appRouter.createCaller(ctx);
  });

  it('should fetch all events', async () => {
    const events = await caller.events.all();
    expect(Array.isArray(events)).toBe(true);
    expect(events.length).toBeGreaterThan(0);
  });

  it('should fetch events by year', async () => {
    const events2000 = await caller.events.byYear(2000);
    expect(Array.isArray(events2000)).toBe(true);
    events2000.forEach((event) => {
      expect(event.year).toBe(2000);
    });
  });

  it('should fetch event by ID', async () => {
    const allEvents = await caller.events.all();
    if (allEvents.length > 0) {
      const firstEvent = allEvents[0];
      const event = await caller.events.byId(firstEvent.id);
      expect(event).toBeDefined();
      expect(event?.id).toBe(firstEvent.id);
    }
  });

  it('should have valid event structure', async () => {
    const events = await caller.events.all();
    if (events.length > 0) {
      const event = events[0];
      expect(event).toHaveProperty('id');
      expect(event).toHaveProperty('title');
      expect(event).toHaveProperty('year');
      expect(event).toHaveProperty('latitude');
      expect(event).toHaveProperty('longitude');
      expect(event).toHaveProperty('location');
      expect(event).toHaveProperty('type');
      expect(typeof event.id).toBe('number');
      expect(typeof event.title).toBe('string');
      expect(typeof event.year).toBe('number');
    }
  });
});

describe('Statistics API', () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    const ctx = createPublicContext();
    caller = appRouter.createCaller(ctx);
  });

  it('should fetch all statistics', async () => {
    const stats = await caller.statistics.all();
    expect(Array.isArray(stats)).toBe(true);
    expect(stats.length).toBeGreaterThan(0);
  });

  it('should fetch statistics by year', async () => {
    const stats2000 = await caller.statistics.byYear(2000);
    if (stats2000) {
      expect(stats2000.year).toBe(2000);
      expect(typeof stats2000.totalFlightDistance).toBe('number');
      expect(typeof stats2000.countriesVisited).toBe('number');
    }
  });

  it('should have valid statistics structure', async () => {
    const stats = await caller.statistics.all();
    if (stats.length > 0) {
      const stat = stats[0];
      expect(stat).toHaveProperty('year');
      expect(stat).toHaveProperty('totalFlightDistance');
      expect(stat).toHaveProperty('countriesVisited');
      expect(stat).toHaveProperty('domesticVisits');
      expect(stat).toHaveProperty('internationalVisits');
      expect(typeof stat.year).toBe('number');
    }
  });
});

describe('Bullet Comments API', () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    const ctx = createPublicContext();
    caller = appRouter.createCaller(ctx);
  });

  it('should fetch bullet comments by event', async () => {
    // Get first event
    const events = await caller.events.all();
    if (events.length > 0) {
      const firstEventId = events[0].id;
      const comments = await caller.bulletComments.byEvent(firstEventId);
      expect(Array.isArray(comments)).toBe(true);
    }
  });
});

describe('Auth API', () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    const ctx = createPublicContext();
    caller = appRouter.createCaller(ctx);
  });

  it('should return null for unauthenticated user', async () => {
    const user = await caller.auth.me();
    expect(user).toBeNull();
  });

  it('should handle logout for unauthenticated user', async () => {
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
  });
});
