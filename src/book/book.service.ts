import { Injectable,NotFoundException } from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose'
import { Book } from './schemas/book.schema';
import * as mongoose from 'mongoose';
@Injectable()
export class BookService {
    constructor(
        @InjectModel(Book.name)
        private bookModel: mongoose.Model<Book>
    ) {}


    async getAllBooks(): Promise<Book[]>{
        const books = await this.bookModel.find()
        return books
    }

    async getSingleBook(id:string): Promise<Book>{
        const book = await this.bookModel.findOne({_id : id})
        if (!book) {
            throw new NotFoundException('Book does not exist')
        }
        return book
    }

    async deleteBook(id:string): Promise<Book>{
        const book = await this.bookModel.findOneAndDelete({_id : id})
        if (!book) {
            throw new NotFoundException('Book does not exist')
        }
        return book
    }

    async updateBook(id:string, book :Book): Promise<Book>{
        const res = await this.bookModel.findOneAndUpdate({_id : id}, book, {runValidators : true, new : true})

        return res
       
    }

    async createBook(book: Book): Promise<Book>{
        const res = await this.bookModel.create(book)
        return res
    }

    
}
