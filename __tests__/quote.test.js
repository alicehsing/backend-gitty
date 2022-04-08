const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('quote routes', () => {
    beforeEach(() => {
        return setup(pool);
      });
    
      afterAll(() => {
        pool.end();
      });

      it('should return an array of quote objects from 3 sets of API', async() => {
        const res = await request(app)
        .get('/api/v1/quotes')

        const expected = [
        { 
            author: expect.any(String), 
            content: expect.any(String) 
        },
        { 
            author: expect.any(String), 
            content: expect.any(String) 
        },
        { 
          author: expect.any(String), 
          content: expect.any(String) 
        },
      ];
      console.log('res.body', res.body);
        expect(res.body).toEqual(expected)
      });
 })