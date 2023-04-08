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
        await request(app)
            .post('/courses')
            .send({title: ''})
            .expect(400)

        await request(app)
            .get('/courses')
            .expect(200, [])
    })

    it('should create course with correct input data', async() => {
        const createResponce = await request(app)
            .post('/courses')
            .send({title: 'broNig'})
            .expect(201)

        const createCourse = createResponce.body;

        expect(createCourse).toEqual({
            id: expect.any(Number),
            title: 'broNig'
        })

        await request(app)
            .get('/courses')
            .expect(200, [createCourse])
    })
})