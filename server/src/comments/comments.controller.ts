import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CurrentUser } from 'src/users/decorator/current-user.decorator';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { JWT_PAYLOAD } from 'src/utils/type';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('api/comments')
@UseGuards(AuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public create(
    @Body(new ValidationPipe({ whitelist: true }))
    createCommentDto: CreateCommentDto,
    @CurrentUser() payload: JWT_PAYLOAD,
  ) {
    return this.commentsService.createNewComment(createCommentDto, payload.id);
  }

  /**
   *Get: /api/comments
   * @param productIdRaw
   * @param userId
   * @param page
   * @param limit
   * @returns
   */
  @Get()
  public async findAll(
    @Query('productId') productIdRaw?: string,
    @Query('userId') userId?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
  ) {
    const productId =
      productIdRaw !== undefined && productIdRaw !== null && productIdRaw !== ''
        ? Number(productIdRaw)
        : undefined;
    return this.commentsService.findAllomments(productId, userId, page, limit);
  }

  /**
   * 
   * @param id 
   * @returns comment
   */
  @Get(':id')
  public async findOne(@Param('id') id: string) {
    return this.commentsService.findOneComment(id);
  }

  /**
   * 
   * @param id 
   * @param updateCommentDto 
   * @param payload 
   * @returns updated comment
   */
  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true }))
    updateCommentDto: UpdateCommentDto,
    @CurrentUser() payload: JWT_PAYLOAD,
  ) {
    return this.commentsService.updateComment(id, updateCommentDto, payload.id);
  }

  /**
   * 
   * @param id 
   * @param payload 
   * @returns deleted comment
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async remove(
    @Param('id') id: string,
    @CurrentUser() payload: JWT_PAYLOAD,
  ) {
    return this.commentsService.removeComment(id, payload.id);
  }
}
