require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('./models/User')
const Task = require('./models/Task')
const auth = require('./middleware/auth')
const validateTask = require('./middleware/validate')

const app = express()
const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskmanager'

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`)
  next()
})

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err.message))

app.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' })
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword
    })

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    })

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user._id, email: user.email }
    })
  } catch (err) {
    next(err)
  }
})

app.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' })
    }

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    })

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, email: user.email }
    })
  } catch (err) {
    next(err)
  }
})

app.get('/me', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.status(200).json(user)
  } catch (err) {
    next(err)
  }
})

app.get('/tasks', auth, async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.status(200).json(tasks)
  } catch (err) {
    next(err)
  }
})

app.post('/tasks', auth, validateTask, async (req, res, next) => {
  try {
    const { title, description, priority } = req.body

    const newTask = await Task.create({
      user: req.user.id,
      title: title.trim(),
      description: description || '',
      priority: priority || 'medium',
      completed: false
    })

    res.status(201).json(newTask)
  } catch (err) {
    next(err)
  }
})

app.put('/tasks/:id', auth, validateTask, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid task ID format.' })
    }

    const task = await Task.findOne({ _id: req.params.id, user: req.user.id })
    if (!task) {
      return res.status(404).json({ error: 'Task not found or unauthorized.' })
    }

    if (req.body.title !== undefined) task.title = req.body.title.trim()
    if (req.body.description !== undefined) task.description = req.body.description
    if (req.body.priority !== undefined) task.priority = req.body.priority
    if (req.body.completed !== undefined) task.completed = req.body.completed

    const updatedTask = await task.save()
    res.status(200).json(updatedTask)
  } catch (err) {
    next(err)
  }
})

app.delete('/tasks/:id', auth, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid task ID format.' })
    }

    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id })
    if (!task) {
      return res.status(404).json({ error: 'Task not found or unauthorized.' })
    }

    res.status(200).json({ message: 'Task deleted successfully', task })
  } catch (err) {
    next(err)
  }
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: err.message || 'Server error' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
