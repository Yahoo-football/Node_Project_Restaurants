import app from './src/app.js';
import { connectDB } from './src/config/db.js';

const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || 'localhost';

class Server {
  public async start(): Promise<void> {
    await connectDB();

    app.listen(port, () => {
      console.log(`Server is running on http://${host}:${port}`);
    });
  }
}

const server = new Server();

const bootstrap = async (): Promise<void> => {
  try {
    await server.start();
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

void bootstrap();
