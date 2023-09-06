import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3333;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Sample route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Express server with TypeScript!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
