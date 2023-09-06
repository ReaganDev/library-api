import { BadRequestException, Injectable,NotFoundException } from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose'
import { Book } from './schemas/book.schema';
import { Query } from 'express-serve-static-core'

import * as mongoose from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
@Injectable()
export class BookService {
    constructor(
        @InjectModel(Book.name)
        private bookModel: mongoose.Model<Book>
    ) {}

    async getAllBooks(query: Query, user: User): Promise<Book[]>{
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
        const books = await this.bookModel.find({user:user._id ,...keys}).limit(itemsPerPage).skip(skip)
        return books
    }

    async getSingleBook(id:string,user: User): Promise<Book>{
        const isValidId = await this.validateId(id)
        if (!isValidId) {
            throw new BadRequestException('Please provide a valid id')
        }

        const book = await this.bookModel.findOne({_id : id,user: user._id})
        if (!book) {
            throw new NotFoundException('Book does not exist')
        }
        return book
    }

    async deleteBook(id:string,user: User): Promise<Book>{
        const isValidId = await this.validateId(id)
        if (!isValidId) {
            throw new BadRequestException('Please provide a valid id')
        }
        
        const book = await this.bookModel.findOneAndDelete({_id : id,user: user._id})
        if (!book) {
            throw new NotFoundException('Book does not exist')
        }
        return book
    }

    async updateBook(id:string, book :Book,user: User): Promise<Book>{
        const isValidId = await this.validateId(id)
        if (!isValidId) {
            throw new BadRequestException('Please provide a valid id')
        }

        const res = await this.bookModel.findOneAndUpdate({_id : id,user: user._id}, book, {runValidators : true, new : true})

        return res
       
    }

    async createBook(book: Book, user: User): Promise<Book>{
        const data = Object.assign(book,{user: user._id})
        const res = await this.bookModel.create(data)
        return res
    }

    private async validateId(id: string): Promise<boolean>{
        const res = await mongoose.isValidObjectId(id)
        return res
    }
    
}
