const validateTaskInput = (req, res, next) => {
  const { title, priority } = req.body

  if (req.method === 'POST') {
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Title is required and cannot be empty.' })
    }
  }

  if (priority && !['low', 'medium', 'high'].includes(priority)) {
    return res.status(400).json({ error: 'Priority must be low, medium, or high.' })
  }

  next()
}

module.exports = validateTaskInput
