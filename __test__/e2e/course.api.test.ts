import { UpdateCourseModel } from './../../src/models/UpdateCourseModel';
import { CreateCourseModel } from './../../src/models/CreateCourseModel';
import { app } from './../../src/index';
import request from 'supertest'

describe('/course', () => {

    beforeAll(async () => {
        await request(app)
            .delete('/__test__/data')
    })

    it('should return 200 and empty array', async() => {
        await request(app)
            .get('/courses')
            .expect(200, [])
    })

    it('should return 404 for not existing course', async() => {
        await request(app)
            .get('/courses/99999')
            .expect(404)
    })

    it('shouldnt create course with incorrect input data', async() => {

        const data: CreateCourseModel = {title: ''}

        await request(app)
            .post('/courses')
            .send(data)
            .expect(400)

        await request(app)
            .get('/courses')
            .expect(200, [])
    })

    let createdCourse: any = null

    it('should create course with correct input data', async() => {

        const data: CreateCourseModel = {title: 'broNig'}

        const createResponce = await request(app)
            .post('/courses')
            .send(data)
            .expect(201)

        createdCourse = createResponce.body;

        expect(createdCourse).toEqual({
            id: expect.any(Number),
            title: data.title
        })

        await request(app)
            .get('/courses')
            .expect(200, [createdCourse])
    })

    let createdCourse2: any = null;

    it('create one more course', async() => {

        const data: CreateCourseModel = {title: 'broNig2'}

        const createResponce = await request(app)
            .post('/courses')
            .send(data)
            .expect(201)

        createdCourse2 = createResponce.body;

        expect(createdCourse2).toEqual({
            id: expect.any(Number),
            title: data.title
        })

        await request(app)
            .get('/courses')
            .expect(200, [createdCourse, createdCourse2])
    })

    it('shouldnt update course with incorrect input data', async() => {

        const data: UpdateCourseModel = {title: ''}

        await request(app)
            .put('/courses/' + createdCourse.id)
            .send({title: data.title})
            .expect(400)

        await request(app)
            .get('/courses/' + createdCourse.id)
            .expect(200, createdCourse)
    })

    it('shouldnt update course that not exist', async() => {

        const data: UpdateCourseModel = {title: 'good title'}

        await request(app)
            .put('/courses/' + -2)
            .send({title: data.title})
            .expect(404)
    })

    it('should update course with correct input data', async() => {

        const data: UpdateCourseModel = {title: 'good new title'}

        await request(app)
            .put('/courses/' + createdCourse.id)
            .send({title: data.title})
            .expect(204)

        await request(app)
            .get('/courses/' + createdCourse.id)
            .expect(200, {...createdCourse,
                 title: data.title})

        await request(app)
            .get('/courses/' + createdCourse2.id)
            .expect(200, createdCourse2)
    })

    it('should delete both courses', async() => {
        await request(app)
            .delete('/courses/' + createdCourse.id)
            .expect(204)

        await request(app)
            .get('/courses/' + createdCourse.id)
            .expect(404)

        await request(app)
            .delete('/courses/' + createdCourse2.id)
            .expect(204)

        await request(app)
            .get('/courses/' + createdCourse2.id)
            .expect(404)

        await request(app)
            .get('/courses')
            .expect(200, [])
    })

    


})