import { NewsDocument } from '../schemas/news.schema';
import { CreateNewsDto } from '../dto/create-news.dto';
import { UpdateNewsDto } from '../dto/update-news.dto';

export interface INewsRepository {
  create(createNewsDto: CreateNewsDto): Promise<NewsDocument>;
  findAll(): Promise<NewsDocument[]>;
  findById(id: string): Promise<NewsDocument | null>;
  update(id: string, updateNewsDto: UpdateNewsDto): Promise<NewsDocument | null>;
  delete(id: string): Promise<NewsDocument | null>;
}
