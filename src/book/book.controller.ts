import { Body, Controller, Get, Post,Param, Delete, Put, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './dtos/create-book-dto';
import { UpdateBookDto } from './dtos/update-book-dto';
import {Query as ExpressQuery} from 'express-serve-static-core'

@Controller('book')
export class BookController {
    constructor(private readonly bookService: BookService) {}

    @Get()
    async getAllBooks(@Query()query: ExpressQuery): Promise<Book[]>{
        const books = await this.bookService.getAllBooks(query)
        return books
    }

    @Get(':id')
    async getSingleBook(@Param('id')id: string): Promise<Book>{
        const book = await this.bookService.getSingleBook(id)
        return book
    }

    @Delete(':id')
    async deleteBook(@Param('id')id: string): Promise<Book>{
        const book = await this.bookService.deleteBook(id)
        return book
    }

    @Put(':id')
    async updateBook(@Param('id')id: string, @Body() book: UpdateBookDto): Promise<Book>{
        const res = await this.bookService.updateBook(id, book)
        return res
    }


    @Post()
    async createBook(@Body() book: CreateBookDto): Promise<Book>{
        return this.bookService.createBook(book)
    }
}
