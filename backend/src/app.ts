import express from 'express';
import cors from 'cors';
import { config } from './config';
import { notFoundHandler, errorHandler } from './middleware/error';

import authRoutes from './modules/auth/auth.routes';
import catalogRoutes from './modules/catalog/catalog.routes';
import konsumenAuthRoutes from './modules/konsumenAuth/konsumenAuth.routes';
import pesananRoutes from './modules/pesanan/pesanan.routes';
import usersRoutes from './modules/users/users.routes';
import konsumenRoutes from './modules/konsumen/konsumen.routes';
import inventoryRoutes from './modules/inventory/inventory.routes';
import ordersRoutes from './modules/orders/orders.routes';
import invoicesRoutes from './modules/invoices/invoices.routes';
import pengirimanRoutes from './modules/pengiriman/pengiriman.routes';
import broadcastRoutes from './modules/broadcast/broadcast.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';

export function createApp() {
  const app = express();
  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json({ limit: '5mb' })); // longgar untuk gambar base64

  app.get('/health', (_req, res) => res.json({ success: true, data: { status: 'ok', time: new Date().toISOString() } }));

  app.use('/api/public/catalog', catalogRoutes); // publik, tanpa login
  app.use('/api/konsumen-auth', konsumenAuthRoutes); // akun konsumen katalog (opsional)
  app.use('/api/auth', authRoutes);
  app.use('/api/konsumen', konsumenRoutes);
  app.use('/api/inventory', inventoryRoutes);
  app.use('/api/orders', ordersRoutes);
  app.use('/api/invoices', invoicesRoutes);
  app.use('/api/pengiriman', pengirimanRoutes);
  app.use('/api/users', usersRoutes);
  app.use('/api/pesanan', pesananRoutes);
  app.use('/api/broadcast', broadcastRoutes);
  app.use('/api/dashboard', dashboardRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
