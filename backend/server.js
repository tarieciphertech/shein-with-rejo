import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import fs from 'fs'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// In-memory storage (replace with database in production)
let orders = []

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`
    cb(null, uniqueName)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    if (extname && mimetype) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  }
})

// Generate order reference
const generateOrderRef = () => {
  const prefix = 'ORD'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// POST /api/orders - Create new order
app.post('/api/orders', upload.array('screenshots', 10), (req, res) => {
  try {
    const {
      fullName,
      phone,
      email,
      address,
      productLinks,
      size,
      color,
      quantity,
      instructions,
      contactMethod
    } = req.body

    // Validation
    if (!fullName || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: 'Full name, phone, and address are required'
      })
    }

    const orderRef = generateOrderRef()
    const screenshots = req.files ? req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size
    })) : []

    const newOrder = {
      id: uuidv4(),
      orderRef,
      fullName,
      phone,
      email: email || null,
      address,
      productLinks: productLinks ? JSON.parse(productLinks) : [],
      size: size || null,
      color: color || null,
      quantity: parseInt(quantity) || 1,
      instructions: instructions || null,
      contactMethod: contactMethod || 'WhatsApp',
      screenshots,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    orders.push(newOrder)

    res.status(201).json({
      success: true,
      message: 'Order submitted successfully',
      data: {
        orderRef: newOrder.orderRef,
        id: newOrder.id,
        status: newOrder.status
      }
    })
  } catch (error) {
    console.error('Error creating order:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    })
  }
})

// GET /api/orders - Get all orders (add auth middleware in production)
app.get('/api/orders', (req, res) => {
  try {
    const { status, phone, page = 1, limit = 20 } = req.query
    let filteredOrders = [...orders]

    if (status) {
      filteredOrders = filteredOrders.filter(o => o.status === status)
    }
    if (phone) {
      filteredOrders = filteredOrders.filter(o => o.phone.includes(phone))
    }

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + parseInt(limit)
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex)

    res.json({
      success: true,
      data: paginatedOrders,
      pagination: {
        total: filteredOrders.length,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(filteredOrders.length / limit)
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    })
  }
})

// GET /api/orders/:id - Get single order
app.get('/api/orders/:id', (req, res) => {
  try {
    const order = orders.find(o => o.id === req.params.id || o.orderRef === req.params.id)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }

    res.json({
      success: true,
      data: order
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    })
  }
})

// PATCH /api/orders/:id - Update order status
app.patch('/api/orders/:id', (req, res) => {
  try {
    const orderIndex = orders.findIndex(o => o.id === req.params.id || o.orderRef === req.params.id)

    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }

    const allowedStatuses = ['pending', 'reviewed', 'priced', 'paid', 'ordered', 'shipped', 'delivered', 'cancelled']
    const { status } = req.body

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed: ${allowedStatuses.join(', ')}`
      })
    }

    orders[orderIndex] = {
      ...orders[orderIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    }

    res.json({
      success: true,
      message: 'Order updated successfully',
      data: orders[orderIndex]
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update order',
      error: error.message
    })
  }
})

// DELETE /api/orders/:id - Delete order
app.delete('/api/orders/:id', (req, res) => {
  try {
    const orderIndex = orders.findIndex(o => o.id === req.params.id || o.orderRef === req.params.id)

    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }

    const deletedOrder = orders.splice(orderIndex, 1)[0]

    // Clean up uploaded files
    if (deletedOrder.screenshots) {
      deletedOrder.screenshots.forEach(screenshot => {
        const filePath = path.join(uploadsDir, screenshot.filename)
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }
      })
    }

    res.json({
      success: true,
      message: 'Order deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete order',
      error: error.message
    })
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  })
})

app.listen(PORT, () => {
  console.log(`\uD83D\uDE80 Server running on port ${PORT}`)
  console.log(`\uD83D\uDD17 API Base URL: http://localhost:${PORT}/api`)
})

export default app
