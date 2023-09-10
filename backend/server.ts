import express, { Request, Response, Express } from 'express';
import bodyParser from 'body-parser';

export const app  = express();
export const port = 3333;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Sample route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Express server with TypeScript!');
});
///dd
app.get('/test_endpoint', (req: Request, res: Response) => {
  console.log('WORK')
  res.send('please WORK');
});


app.post('frontend_data_to_server',(req: Request, res: Response) => {
  console.log(req)
  res.send(req);
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

