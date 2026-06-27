import { createApp } from './app';
import { config } from './config';

const app = createApp();
app.listen(config.port, () => {
  console.log(`🚀 CDM backend running at http://localhost:${config.port}`);
  console.log(`   Health: http://localhost:${config.port}/health`);
});
