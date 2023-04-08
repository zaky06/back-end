import express from 'express'
export const app = express()
const port = 3000

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

const db = {
   courses: [
        {id: 1, title: 'front-end'},
        {id: 2, title: 'back-end'},
        {id: 3, title: 'automation qa'},
        {id: 4, title: 'devops'},
    ]
}
app.get('/', (req, res) => {
    res.send("Hello")
})


app.get('/courses', (req, res) => {
    let foundCours = db.courses;
    if (req.query.title) {
        foundCours = foundCours.filter(c => c.title.indexOf(req.query.title as string) > -1)
    }
    
    res.json(foundCours)
})

app.post('/courses', (req, res) => {
    if(!req.body.title) {
        res.sendStatus(400)
        return;
    }

    const createCourse = {
        id: +(new Date()),
        title: req.body.title
    }
    db.courses.push(createCourse)
    res.status(201).json(createCourse)
})

app.get('/courses/:id', (req, res) => {
    const foundCourse = db.courses.find(c => c.id === +req.params.id)

    if (!foundCourse) {
        res.sendStatus(404);
        return;
    }

    res.json(foundCourse)
})

app.delete('/courses/:id', (req, res) => {
    db.courses = db.courses.filter(c => c.id !== +req.params.id)
    res.sendStatus(204)
})

app.put('/courses/:id', (req, res) => {
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