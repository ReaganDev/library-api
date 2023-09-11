import { UpdateBookDto } from './dtos/update-book-dto';
import { Category } from './schemas/book.schema';
import { Test, TestingModule } from "@nestjs/testing"
import { BookService } from "./book.service"
import { BookController } from './book.controller';
import { PassportModule } from '@nestjs/passport';
import { CreateBookDto } from './dtos/create-book-dto';


describe('BookController',() => {

    let bookService : BookService
    let bookController : BookController

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
    const mockBookService = {
        getAllBooks: jest.fn().mockResolvedValueOnce([mockBook]),
        createBook: jest.fn(),
        getSingleBook: jest.fn().mockResolvedValueOnce(mockBook),
        deleteBook: jest.fn().mockResolvedValueOnce({deleted: true}),
        updateBook: jest.fn()
    }


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PassportModule.register({defaultStrategy : 'jwt'})],
            controllers: [BookController],
            providers : [
                {
                    provide : BookService,
                    useValue : mockBookService
                }
            ]
        }).compile()

        bookService = module.get<BookService>(BookService)
        bookController = module.get<BookController>(BookController)
    })

    it('should be defined', () => {
        expect(bookController).toBeDefined()
    })

    describe('get all books', () => {
        it('should return all books',async () => {
            const result = await bookController.getAllBooks({page : '1', keyword : 'test'}, mockUser)

            expect(bookService.getAllBooks).toHaveBeenCalled()
            expect(result).toEqual([mockBook])
        })
    })

    describe('get a single book', () => {
        it('should return a book',async () => {
            const result = await bookController.getSingleBook(mockBook._id, mockUser)

            expect(bookService.getSingleBook).toHaveBeenCalled()
            expect(result).toEqual(mockBook)
        })
    })

    describe('delete a single book', () => {
        it('should delete a book',async () => {
            const result = await bookController.deleteBook(mockBook._id, mockUser)

            expect(bookService.deleteBook).toHaveBeenCalled()
            //expect(result).toEqual(mockBook)
            expect(result).toEqual({deleted : true})
        })
    })

    describe('update a single book', () => {
        it('should update a book',async () => {
            const updatedBook = {...mockBook, title: 'Updated Book'};
            const book = {title: 'Updated Book'}
            mockBookService.updateBook = jest.fn().mockResolvedValueOnce(updatedBook)
            const result = await bookController.updateBook(updatedBook._id, book as UpdateBookDto, mockUser)

            expect(bookService.updateBook).toHaveBeenCalled()
            expect(result).toEqual(updatedBook)
        })
    })



    describe('create book', () => {
        it('should create a new book',async () => {
            const newBook = {
                title: 'New Book',
                description: 'Book Description',
                author: 'Author',
                price: 100,
                category: Category.FANTASY,
              };

              mockBookService.createBook = jest.fn().mockResolvedValueOnce(mockBook)
            const result = await bookController.createBook(newBook as CreateBookDto, mockUser)

            expect(bookService.createBook).toHaveBeenCalled()
            expect(result).toEqual(mockBook)
        })
    })
    
})