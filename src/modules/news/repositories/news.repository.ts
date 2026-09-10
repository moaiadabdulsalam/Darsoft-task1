import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { News, NewsDocument } from '../schemas/news.schema';
import { CreateNewsDto } from '../dto/create-news.dto';
import { UpdateNewsDto } from '../dto/update-news.dto';
import { INewsRepository } from '../interfaces/news-repository.interface';

@Injectable()
export class NewsRepository implements INewsRepository {
  constructor(
    @InjectModel(News.name) private readonly newsModel: Model<NewsDocument>,
  ) {}

  async create(createNewsDto: CreateNewsDto): Promise<NewsDocument> {
    const news = new this.newsModel(createNewsDto);
    return news.save();
  }

  async findAll(): Promise<NewsDocument[]> {
    return this.newsModel.find().sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<NewsDocument | null> {
    return this.newsModel.findById(id).exec();
  }

  async update(id: string, updateNewsDto: UpdateNewsDto): Promise<NewsDocument | null> {
    return this.newsModel
      .findByIdAndUpdate(id, { $set: updateNewsDto }, { new: true })
      .exec();
  }

  async delete(id: string): Promise<NewsDocument | null> {
    return await this.newsModel.findByIdAndDelete(id).exec();
  }
}
