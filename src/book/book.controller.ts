import { Body, Controller, Get, Post,Param, Delete, Put, Query, HttpCode, UseGuards, Req } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './dtos/create-book-dto';
import { UpdateBookDto } from './dtos/update-book-dto';
import {Query as ExpressQuery} from 'express-serve-static-core'
import { AuthGuard } from '@nestjs/passport';

@Controller('book')
export class BookController {
    constructor(private readonly bookService: BookService) {}

    @Get()
    @UseGuards(AuthGuard())
    @HttpCode(200)
    async getAllBooks(@Query()query: ExpressQuery, @Req() req): Promise<Book[]>{
        const books = await this.bookService.getAllBooks(query, req.user)
        return books
    }

    @Get(':id')
    @UseGuards(AuthGuard())
    @HttpCode(200)
    async getSingleBook(@Param('id')id: string, @Req() req): Promise<Book>{
        const book = await this.bookService.getSingleBook(id, req.user)
        return book
    }

    @Delete(':id')
    @UseGuards(AuthGuard())
    @HttpCode(200)
    async deleteBook(@Param('id')id: string, @Req() req): Promise<{deleted : boolean}>{
        const result = await this.bookService.deleteBook(id, req.user)
        return result
    }

    @Put(':id')
    @UseGuards(AuthGuard())
    @HttpCode(200)
    async updateBook(@Param('id')id: string, @Body() book: UpdateBookDto, @Req() req): Promise<Book>{
        const res = await this.bookService.updateBook(id, book, req.user)
        return res
    }


    @Post()
    @UseGuards(AuthGuard())
    async createBook(@Body() book: CreateBookDto,@Req() req): Promise<Book>{
        return this.bookService.createBook(book,req.user)
    }
}
