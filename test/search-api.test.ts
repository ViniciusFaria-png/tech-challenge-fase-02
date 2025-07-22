import Fastify from 'fastify';
import { search } from '../src/http/controller/post/search';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

const fastify = Fastify();

// Register the /search route for testing
fastify.get('/search', search);

describe('/search API', () => {
  beforeAll(async () => {
    await fastify.ready();
  });

  afterAll(async () => {
    await fastify.close();
  });

  test('should return 200 and a post for a valid query', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/search?query=test',
    });
    expect(response.statusCode).toBe(200);
    // You can add more assertions based on your expected response
  });

  test('should return 404 for a query with no results', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/search?query=notfound',
    });
    expect(response.statusCode).toBe(404);
  });
});
