require("dotenv").config();
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.json())

app.use(morgan("tiny"))

app.use(cors())

app.use(express.static('build'))
  
app.get('/info', (req, res) => {
  Person.countDocuments({}).then(count => {

    const date = new Date()
    res.send(`<div>Phonebook has info for ${count} people</div>
              <p>${date}</p>`)
  })
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(result => {
    res.json(result)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id).then(person => {
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(request.body)
  const name = body.name
  const number = body.number
  if (!name || !number) {
    return response.status(400).json( {
      error: 'name or number missing'
    })
  }
  //if (persons.find(person => person.name === name)){
  //  return response.status(400).json( {
  //    error: 'name must be unique'
  //  })
  //}
  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson =>{
    response.json(savedPerson)
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(request.params.id, person, {new: true})
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({error: 'malformatted id'})
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})