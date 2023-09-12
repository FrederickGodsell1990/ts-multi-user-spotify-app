import request from 'supertest';
import {app, port} from '../server'; 
import http from 'http'; 


describe('Express Server', () => {

  it('responds with "Hello, Express server with TypeScript!" when making a GET request to /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello, Express server with TypeScript!');
  });

  it('frontend_data_to_server POST request worked', async () => {
    const response = await request(app).post('/frontend_data_to_server');
    expect(response.status).toBe(200);
    expect(response.text).toBe('frontend_data_to_server POST request worked');
  });
});
