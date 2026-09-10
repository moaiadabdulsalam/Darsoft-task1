import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { News, NewsSchema } from './schemas/news.schema';
import { NewsRepository } from './repositories/news.repository';
import { NewsService } from './services/news.service';
import { NewsController } from './controllers/news.controller';
import { NewsGateway } from './gateways/news.gateway';
import { RedisModule } from '../redis/redis.module';
import { NEWS_SERVICE, NEWS_REPOSITORY } from './constants/news.tokens';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }]),
  ],
  controllers: [NewsController],
  providers: [
    {
      provide: NEWS_REPOSITORY,
      useClass: NewsRepository,
    },
    {
      provide: NEWS_SERVICE,
      useClass: NewsService,
    },
    NewsGateway,
  ],
  exports: [NEWS_SERVICE],
})
export class NewsModule {}
