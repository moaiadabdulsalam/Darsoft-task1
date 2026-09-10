import { Injectable, Inject, NotFoundException, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../redis/redis.module';
import { NewsGateway } from '../gateways/news.gateway';
import { CreateNewsDto } from '../dto/create-news.dto';
import { UpdateNewsDto } from '../dto/update-news.dto';
import { NewsDocument } from '../schemas/news.schema';
import type { INewsService } from '../interfaces/news-service.interface';
import type { INewsRepository } from '../interfaces/news-repository.interface';
import { NEWS_CACHE_KEY, NEWS_CACHE_TTL } from '../constants/news.constants';
import { NEWS_REPOSITORY } from '../constants/news.tokens';

@Injectable()
export class NewsService implements INewsService {
  private readonly logger = new Logger(NewsService.name);

  constructor(
    @Inject(NEWS_REPOSITORY) private readonly newsRepository: INewsRepository,
    private readonly newsGateway: NewsGateway,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  async create(createNewsDto: CreateNewsDto): Promise<NewsDocument> {
    const news = await this.newsRepository.create(createNewsDto);

    await this.invalidateCache();
    this.newsGateway.emitNewsCreated(news);

    return news;
  }

  async findAll(): Promise<NewsDocument[]> {
    const cached = await this.redis.get(NEWS_CACHE_KEY);
    if (cached) {
      this.logger.log('📦 Returning news from Redis cache');
      return JSON.parse(cached);
    }

    const news = await this.newsRepository.findAll();

    await this.redis.set(NEWS_CACHE_KEY, JSON.stringify(news), 'EX', NEWS_CACHE_TTL);
    this.logger.log('💾 News cached in Redis');

    return news;
  }

  async findById(id: string): Promise<NewsDocument | null> {
    const news = await this.newsRepository.findById(id);
    if (!news) {
      throw new NotFoundException('News not found');
    }
    return news;
  }

  async update(id: string, updateNewsDto: UpdateNewsDto): Promise<NewsDocument | null> {
    const updatedNews = await this.newsRepository.update(id, updateNewsDto);
    if (!updatedNews) {
      throw new NotFoundException('News not found');
    }

    await this.invalidateCache();
    this.newsGateway.emitNewsUpdated(updatedNews);

    return updatedNews;
  }

  async delete(id: string): Promise<void> {
    const deletedNews = await this.newsRepository.delete(id);
    if (!deletedNews) {
      throw new NotFoundException('News not found');
    }

    await this.invalidateCache();
    this.newsGateway.emitNewsDeleted(id);
  }

  private async invalidateCache(): Promise<void> {
    await this.redis.del(NEWS_CACHE_KEY);
    this.logger.log('🗑️ News cache invalidated');
  }
}
