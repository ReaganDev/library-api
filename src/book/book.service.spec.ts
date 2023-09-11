import { Book, Category } from './schemas/book.schema';
import { Test, TestingModule } from "@nestjs/testing"
import { BookService } from "./book.service"
import { getModelToken } from "@nestjs/mongoose"
import mongoose, { Model } from 'mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dtos/create-book-dto';
import { User } from '../auth/schemas/user.schema';
import { UpdateBookDto } from './dtos/update-book-dto';


describe('BookService',() => {

    let bookService : BookService
    let model : Model<Book>
    const mockBookService = {
        findById: jest.fn(),
        find: jest.fn(),
        create: jest.fn(),
        findOne: jest.fn(),
        findOneAndUpdate : jest.fn(),
        findOneAndDelete: jest.fn()
    }

    const mockBook = {    
        _id : '64f6c5b5e060b39d741760a2',
        title : "Canada",
        description : "A tale about Canada",
        user: '64f8b0315d807f59d3f9cdda',
        author : "Reuben",
        price : 30,
        category : Category.ADVENTURE
    }

    const mockUser = {
        _id : '64f8b0315d807f59d3f9cdda',
        name: 'Reuben',
        email:'Chinonso@gmail.com'
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers : [
                BookService,
                {
                    provide : getModelToken(Book.name),
                    useValue : mockBookService
                }
            ]
        }).compile()

        bookService = module.get<BookService>(BookService)
        model = module.get<Model<Book>>(getModelToken(Book.name))
    })

    describe('updateBook', () => {
        it('should update a book', async () => {
            const updatedBook = {...mockBook, title: 'Updated Book'};
            const book = {title: 'Updated Book'}
        
              jest
                .spyOn(model, 'findOneAndUpdate')
                .mockResolvedValue(updatedBook)
        
              const result = await bookService.updateBook(updatedBook._id, book as UpdateBookDto, mockUser as User);
        
              expect(result).toEqual(updatedBook);
          
        })
    })
    
    describe('deleteBook', () => {
        it('should delete a book', async () => {
            jest.spyOn(model, 'findOneAndDelete').mockResolvedValue(mockBook)

            const result = await bookService.deleteBook(mockBook._id, mockUser as User)

            //expect(result).toEqual(mockBook)
            expect(result).toEqual({deleted : true})
          
        })

        it('should throw an BadRequestException if an invalid is passed', async () => {
            const id = 'invalid-id'
            const isValidId = jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false)

            await expect(bookService.deleteBook(id, mockUser as User)).rejects.toThrow(BadRequestException)
            expect(isValidId).toHaveBeenCalledWith(id)
            isValidId.mockRestore()
        })

        it('should throw an NotFoundException if book is not found', async () => {
            jest.spyOn(model, 'findOneAndDelete').mockResolvedValue(null)
            const id = '64f8b0315d807f59d3f9cdda'

            await expect(bookService.deleteBook(id, mockUser as User)).rejects.toThrow(NotFoundException)
            
        })

    })

    describe('createBook', () => {
        it('should create a book', async () => {
            const newBook = {
                title: 'New Book',
                description: 'Book Description',
                author: 'Author',
                price: 100,
                category: Category.FANTASY,
              };
        
              jest
                .spyOn(model, 'create')
                .mockImplementationOnce(() => Promise.resolve<Book | any>(mockBook));
        
              const result = await bookService.createBook(
                newBook as CreateBookDto,
                mockUser as User,
              );
        
              expect(result).toEqual(mockBook);
          
        })
    })

    describe('getAllBooks', () => {
        it('should return an array books', async () => {
            const query = {page: '1', keyword: 'test'}

            jest.spyOn(model, 'find').mockImplementation(() => (
                {
                    limit: () => ({
                        skip: jest.fn().mockResolvedValue([mockBook])
                    })
                } as any
            ),);
            
            const result = await bookService.getAllBooks(query, mockUser as User)
            expect(result).toEqual([mockBook])
        })
    })


    describe('getSingleBook', () => {
        it('should find and return a book by id', async () => {
            jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockBook)

            const result = await bookService.getSingleBook(mockBook._id, mockUser as User)
            expect(result).toEqual(mockBook)
        })

        it('should throw an BadRequestException if an invalid is passed', async () => {
            const id = 'invalid-id'
            const isValidId = jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false)

            await expect(bookService.getSingleBook(id, mockUser as User)).rejects.toThrow(BadRequestException)
            expect(isValidId).toHaveBeenCalledWith(id)
            isValidId.mockRestore()
        })

        it('should throw an NotFoundException if book is not found', async () => {
            jest.spyOn(model, 'findOne').mockResolvedValue(null)
            const id = '64f8b0315d807f59d3f9cdda'

            await expect(bookService.getSingleBook(mockBook._id, mockUser as User)).rejects.toThrow(NotFoundException)
        })
    })

})