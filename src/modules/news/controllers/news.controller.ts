import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { NEWS_SERVICE } from '../constants/news.tokens';
import type { INewsService } from '../interfaces/news-service.interface';
import { CreateNewsDto } from '../dto/create-news.dto';
import { UpdateNewsDto } from '../dto/update-news.dto';
import { Role } from 'src/common/enums/role.enums';

@ApiTags('News')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.USER, Role.ADMIN)
@Controller('news')
export class NewsController {
  constructor(
    @Inject(NEWS_SERVICE) private readonly newsService: INewsService,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create news (Admin only)' })
  @ApiResponse({ status: 201, description: 'News created + broadcasted via WebSocket' })
  @ApiResponse({ status: 403, description: 'Forbidden — Admin role required' })
  async create(@Body() createNewsDto: CreateNewsDto) {
    const news = await this.newsService.create(createNewsDto);
    return { message: 'News created successfully', news };
  }

  @Get()
  @ApiOperation({ summary: 'Get all news (cached via Redis, authenticated users)' })
  @ApiResponse({ status: 200, description: 'List of all news' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll() {
    const news = await this.newsService.findAll();
    return { news };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single news by ID (authenticated users)' })
  @ApiResponse({ status: 200, description: 'News details' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'News not found' })
  async findOne(@Param('id') id: string) {
    const news = await this.newsService.findById(id);
    return { news };
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update news (Admin only)' })
  @ApiResponse({ status: 200, description: 'News updated + broadcasted via WebSocket' })
  @ApiResponse({ status: 403, description: 'Forbidden — Admin role required' })
  @ApiResponse({ status: 404, description: 'News not found' })
  async update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    const news = await this.newsService.update(id, updateNewsDto);
    return { message: 'News updated successfully', news };
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete news (Admin only)' })
  @ApiResponse({ status: 200, description: 'News deleted + broadcasted via WebSocket' })
  @ApiResponse({ status: 403, description: 'Forbidden — Admin role required' })
  @ApiResponse({ status: 404, description: 'News not found' })
  async delete(@Param('id') id: string) {
    await this.newsService.delete(id);
    return { message: 'News deleted successfully' };
  }
}
