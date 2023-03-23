import express from 'express'
const app = express()
const port = 3000

app.get('/', (req, res) => {
    const a = 6;
    if (a>5) {
        res.send('Hello World!')
    } else {
        res.send(`${a}`)
    }
    
})

app.get('/users', (req, res) => {
    res.send('Hello users!!!')
})

app.post('/users', (req, res) => {
    res.send('We have create users')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})