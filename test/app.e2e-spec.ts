import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import mongoose from 'mongoose';
import { Category } from '../src/book/schemas/book.schema';

describe('Book & Auth Controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeAll(async () => {
    try {
      // Connect to the MongoDB database using the MONGO_PATH environment variable
      await mongoose.connect(process.env.MONGO_PATH1);
  
      // Drop the database
      await mongoose.connection.db.dropDatabase();
    } catch (error) {
      console.error('Error setting up the test environment:', error);
    }
  }, 50000);

  afterAll(() => mongoose.disconnect());

  const registerDto = {
    name: 'Reuben',
    email:'femo@gmail.com',
    password: 'Reagan95'
  }

  const loginDto = {
    email:'femo@gmail.com',
    password: 'Reagan95'
  }

  let jwtToken: string = ''
  let bookCreated

  const mockBook = {    
    title : "Canada",
    description : "A tale about Canada",
    author : "Reuben",
    price : 30,
    category : Category.ADVENTURE
}

const book = {title: 'Updated Book'}

  describe('AUTH', () => {

    it('(POST) should register a user', () => {
      return request(app.getHttpServer())
        .post('/auth')
        .send(registerDto)
        .expect(201)
        .then((res) => {
          expect(res.body.token).toBeDefined()
        });
    });
  
    it('(POST) should login a user', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200)
        .then((res) => {
          expect(res.body.token).toBeDefined()
          jwtToken = res.body.token
        });
    });
  })


  describe('BOOK', () => {
    it('(POST) should create a book', () => {
      return request(app.getHttpServer())
        .post('/book')
        .set('Authorization', 'Bearer ' + jwtToken)
        .send(mockBook)
        .expect(201)
        .then((res) => {
          expect(res.body._id).toBeDefined()
          expect(res.body.title).toEqual(mockBook.title)
          bookCreated = res.body
        });
    });

    // it('(GET) should get all books', () => {
    //   return request(app.getHttpServer())
    //     .get('/book')
    //     .set('Authorization', 'Bearer ' + jwtToken)
    //     .expect(200)
    //     .then((res) => {
    //       expect(res.body.length).toBe(1)
    //     });
    // });

    // it('(GET) should get a single book', () => {
    //   return request(app.getHttpServer())
    //     .get(`/book/${bookCreated?._id}`)
    //     .set('Authorization', 'Bearer ' + jwtToken)
    //     .expect(200)
    //     .then((res) => {
    //       expect(res.body).toBeDefined()
    //       expect(res.body._id).toEqual(bookCreated._id)
    //       expect(res.body.title).toEqual(bookCreated.title)
    //     });
    // });

    // it('(PUT) should get a single book', () => {
    //   return request(app.getHttpServer())
    //     .put(`/book/${bookCreated?._id}`)
    //     .set('Authorization', 'Bearer ' + jwtToken)
    //     .send(book)
    //     .expect(200)
    //     .then((res) => {
    //       expect(res.body).toBeDefined()
    //       expect(res.body._id).toEqual(bookCreated._id)
    //       expect(res.body.title).toEqual(book.title)
    //     });
    // });

    it('(DELETE) should delete a single book', () => {
      return request(app.getHttpServer())
        .delete(`/book/${bookCreated?._id}`)
        .set('Authorization', 'Bearer ' + jwtToken)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined()
          console.log(res.body);
          expect(res.body.deleted).toEqual(true)
        });
    });
  })

  
});
