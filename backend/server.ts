import express, { Request, Response, Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'
import mongoose from 'mongoose';
import testDataSchema from './mongoDBModels/testSchema'

export const app  = express();
export const port = 3333;

// Middleware to parse JSON requests
app.use(bodyParser.json());




app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // This allows credentials like cookies to be sent in requests (if needed)
}));

// Sample route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Express server with TypeScript!');
});
///dd
app.get('/test_endpoint', (req: Request, res: Response) => {
  console.log('change again')
  res.send('change again');
});


app.post('/frontend_data_to_server', async (req: Request, res: Response) => {

  console.log('req.body is;', req.body)
 
  const testDataSchemaOnBackEnd = new testDataSchema({testData : req.body?.inputValue});
 
  try{
  console.log('testDataSchemaOnBackEnd is', testDataSchemaOnBackEnd)

  const saveToBackEnd = await testDataSchemaOnBackEnd.save()
 
  res.send(saveToBackEnd);

 }
 catch(error){
console.log(error)
 }
 
})

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });


mongoose.connect('mongodb+srv://frederickgodsell:Fs6pIF2Evt64PUs1@multiuserspotifyapp.fxm38gv.mongodb.net/?retryWrites=true&w=majority', { 
})
.then((result) => {
  app.listen(port);
  console.log("Mongo listening");
  console.log(`Server is running on http://localhost:${port}`);
})
.catch((err) => console.log("err", err));