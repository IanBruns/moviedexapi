require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const movies = require('./moviedex.json')

const app = express()

app.use(morgan('dev'))
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    next();
})

handleSearchMovie = (req, res) => {
    results = movies;
    if (req.query.genre) {
        results = results.filter(movie => {
            return movie.genre.toLowerCase().includes(req.query.genre.toLowerCase());
        })
    }
    if (req.query.country) {
        results = results.filter(movie => {
            return movie.country.toLowerCase().includes(req.query.country.toLowerCase());
        })
    }
    if (req.query.avg_vote) {
        results = results.filter(movie => {
            return movie.avg_vote >= Number(req.query.avg_vote)
        })
    }
    res.json(results);
}

app.get('/movie', handleSearchMovie);

const PORT = 8000

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})