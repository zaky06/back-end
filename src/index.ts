import { UriParamsidModel } from './models/UriParamsidModel';
import { CourseViewModel } from './models/CourseViewModel';
import { QueryCoursesModel } from './models/QueryCoursesModel';
import { CreateCourseModel } from './models/CreateCourseModel';
import { UpdateCourseModel } from './models/UpdateCourseModel';
import { RequestWithQuery, RequestWithBody, RequestWithParams, RequestWithParamsAndBody } from './types';
import express, { Request, Response } from 'express'
export const app = express()
const port = 3000

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

type CourseType = {
    id: number,
    title: string,
    studentsCount: number
}

const db: {courses: CourseType[]} = {
   courses: [
        {id: 1, title: 'front-end', studentsCount: 10},
        {id: 2, title: 'back-end', studentsCount: 10},
        {id: 3, title: 'automation qa', studentsCount: 10},
        {id: 4, title: 'devops', studentsCount: 10},
    ]
}
app.get('/', (req, res) => {
    res.send("Hello")
})


app.get('/courses', (req: RequestWithQuery<QueryCoursesModel>, 
    res: Response<CourseViewModel[]>) => {

    let foundCourses = db.courses;

    if (req.query.title) {
        foundCourses = foundCourses.filter(c => c.title.indexOf(req.query.title) > -1)
    }
    
    res.json(foundCourses.map(dbCourse => {
        return {
            id: dbCourse.id,
            title: dbCourse.title
        }
    })) 
})

app.post('/courses', (req: RequestWithBody<CreateCourseModel>,
    res: Response<CourseViewModel>) => {
    if(!req.body.title) {
        res.sendStatus(400)
        return;
    }

    const createCourse: CourseType = {
        id: +(new Date()),
        title: req.body.title,
        studentsCount: 0
    }
    db.courses.push(createCourse)
    res.status(201).json({
        id: createCourse.id,
        title: createCourse.title
    })
})

app.get('/courses/:id', (req: RequestWithParams<UriParamsidModel>, 
    res: Response<CourseViewModel>) => {
    const foundCourse = db.courses.find(c => c.id === +req.params.id)

    if (!foundCourse) {
        res.sendStatus(404);
        return;
    } 

    res.json({
        id: foundCourse.id,
        title: foundCourse.title
    })
})

app.delete('/courses/:id', (req: RequestWithParams<UriParamsidModel>, res) => {
    db.courses = db.courses.filter(c => c.id !== +req.params.id)
    res.sendStatus(204)
})

app.put('/courses/:id', (req: RequestWithParamsAndBody<UriParamsidModel, UpdateCourseModel>, res) => {
    const foundCourse = db.courses.find(c => c.id === +req.params.id)

    if (!req.body.title) {
        res.sendStatus(400);
        return;
    }

    if (!foundCourse) {
        res.sendStatus(404);
        return;
    }

    foundCourse.title = req.body.title;
    res.sendStatus(204);
})

app.delete('/__test__/data', (req, res) => {
    db.courses = [];
    res.sendStatus(204)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})