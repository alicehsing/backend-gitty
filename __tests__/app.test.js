const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Post = require('../lib/models/Post');
const { agent } = require('supertest');

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

  it('should create a post for authenticated user via POST', async () => {
    const agent = request.agent(app);
    await agent.get('/api/v1/github/login/callback?code=42').redirects(1);

    return agent
      .post('/api/v1/posts')
      .send({ text: 'My first tweet' })
      .then((res) => {
        expect(res.body).toEqual({
          id: expect.any(String),
          text: 'My first tweet',
          username: 'fake_github_user',
        });
      });
  });

  it('should delete an authenticated user via DELETE', async () => {
    // bring in an signed in user
    const agent = request.agent(app);
    await agent.get('/api/v1/github/login/callback?code=42').redirects(1);

    //signed in user post a text
    const res = await agent
      .post('/api/v1/posts')
      .send({ text: 'My first tweet' });

    expect(res.body).toEqual({
      id: expect.any(String),
      text: 'My first tweet',
      username: 'fake_github_user',
    });

    // delete a user
    const res2 = await agent.delete('/api/v1/github');

    // unauthenticated user should not be able to post
    const res3 = await agent
      .post('/api/v1/posts')
      .send({ text: 'Another text' });

    expect(res3.body).toEqual({
      message: 'jwt must be provided',
      status: 500,
    });
  });

  // GET /api/v1/posts so that signed in users can view a list of posts
  it('should list all posts for all users', async () => {
    const agent = request.agent(app);
    await agent.get('/api/v1/github/login/callback?code=42').redirects(1);

    const expected = await Post.getAll();
    const res = await agent.get('/api/v1/posts');

    expect(res.body).toEqual(expected);
  });
});
