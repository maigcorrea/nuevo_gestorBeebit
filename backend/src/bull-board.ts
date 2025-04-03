import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { Queue } from 'bull';
import { mailQueue } from './mail/mail-queue/bull.instance'; // <- crea y exporta la instancia real de la cola


const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

export function setupBullBoard(app: any) {

  createBullBoard({
    queues: [new BullAdapter(mailQueue)],
    serverAdapter,
  });

  app.use('/admin/queues', serverAdapter.getRouter());
}