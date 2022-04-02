const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');


jest.mock('../lib/utils/github');

describe('backend-gitty routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should redirect to the github oauth page upon login', async () => {
    const res = await request(app).get('/api/v1/github/login');
  
    expect(res.header.location).toMatch(
      /https:\/\/github.com\/login\/oauth\/authorize\?client_id=[\w\d]+&scope=user&redirect_uri=http:\/\/localhost:7890\/api\/v1\/github\/login\/callback/i
    );
  });
  

  it('should login and redirect users to /api/v1/posts', async () => {
    const res = await request
      .agent(app)
      .get('/api/v1/github/login/callback?code=42')
      .redirects(1);

      expect(res.req.path).toEqual('/api/v1/posts');
  });


  it('should create a post for authenticated user via POST', async() => {
    const agent = request.agent(app);
    const user = await agent
      .get('/api/v1/github/login/callback?code=42')
      .redirects(1);
    console.log(user);
    return agent
    .post('/api/v1/posts')
    .send({ text: 'My first tweet' })
    .then((res) => {
      expect(res.body).toEqual({
        id: expect.any(String),
        text: 'My first tweet',
        username: 'fake_github_user'
      });
    });

  });
});

