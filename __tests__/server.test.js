'use strict';

const app = require('../lib/server.js');
const supergoose = require('@code-fellows/supergoose');

const mockRequest = supergoose(app.server);

describe('Error middleware works', () => {
  it('gives a 404 error when accessing', async () => {
    let response = await mockRequest.delete('/notauser');
    let str = response.status;
    console.log('RESPONSE', response.status);
    expect(str).toBe(404);
  });

  it('gives a lets us know when a user is not authorized', async () => {
    let response = await mockRequest.get('/signin');
    let str = response.status;
    console.log('NOT AUTH', response.status);
    expect(str).toBe(404);
  });
});
