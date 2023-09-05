import { Injectable,NotFoundException } from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose'
import { Book } from './schemas/book.schema';
import { Query } from 'express-serve-static-core'

import * as mongoose from 'mongoose';
@Injectable()
export class BookService {
    constructor(
        @InjectModel(Book.name)
        private bookModel: mongoose.Model<Book>
    ) {}

    async getAllBooks(query: Query): Promise<Book[]>{
        const itemsPerPage = 2
        
        const currentPage = Number(query.page) || 1
        console.log(query.page);
        const skip = itemsPerPage * (currentPage - 1)
        const keys = query.search ? {
            title: {
                $regex: query.search,
                $options: 'i'
            }
        } : {}
        const books = await this.bookModel.find({...keys}).limit(itemsPerPage).skip(skip)
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
