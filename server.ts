import dotenv from 'dotenv';

import app from './src/app.js';

dotenv.config();

const port = Number(process.env.PORT) || 3000;
const host = Number(process.env.HOST) || 'localhost';


app.listen(port, () => {
  console.log(`Server is running on port http://${host}:${port}`);
});
