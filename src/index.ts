import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

const app = new Hono()

// Middlewares
app.use('*', logger())
app.use('*', cors())

// Routes
app.get('/', (c) => {
  return c.json({
    name: 'hono-deployment-testing-app',
    status: 'running',
    message: 'Hono TypeScript Backend is live!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  })
})

app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  }, 200)
})

// Server configuration
const port = Number(process.env.PORT) || 3000

console.log(`Server is running on port http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
