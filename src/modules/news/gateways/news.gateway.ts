import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { NewsDocument } from '../schemas/news.schema';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NewsGateway {
  private readonly logger = new Logger(NewsGateway.name);

  @WebSocketServer()
  server: Server;

  emitNewsCreated(news: NewsDocument): void {
    this.server.emit('newsCreated', news);
    this.logger.log(`📢 Broadcasted newsCreated: ${news.title}`);
  }

  emitNewsUpdated(news: NewsDocument): void {
    this.server.emit('newsUpdated', news);
    this.logger.log(`📢 Broadcasted newsUpdated: ${news.title}`);
  }

  emitNewsDeleted(newsId: string): void {
    this.server.emit('newsDeleted', { id: newsId });
    this.logger.log(`📢 Broadcasted newsDeleted: ${newsId}`);
  }
}
