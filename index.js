const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())

app.use(morgan("tiny"))

app.use(cors())

let persons = [    
      { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      {
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
    ]
  
  
app.get('/info', (req, res) => {
  const amount = persons.length
  const date = new Date()
  res.send(`<div>Phonebook has info for ${amount} people</div>
            <p>${date}</p>`)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const person = request.body
  console.log(request.body)
  const name = person.name
  const number = person.number
  if (!name || !number) {
    return response.status(400).json( {
      error: 'name or number missing'
    })
  }
  if (persons.find(person => person.name === name)){
    return response.status(400).json( {
      error: 'name must be unique'
    })
  }

  const id = parseInt(Math.random()*1000)
  person.id = id
  persons = persons.concat(person)
  response.json(person)
})


const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)