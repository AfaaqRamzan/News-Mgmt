import express from 'express';
import "dotenv/config"

const app = express();
const port = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.send('Hello World!, Heroku!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Server link : http://localhost:${port}`);
});