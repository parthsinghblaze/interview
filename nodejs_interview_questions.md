# Node.js Interview Questions for 3-4 Years Experience

## Core Node.js Concepts

### Q: What is the Event Loop in Node.js and how does it work?

**A:** The Event Loop is the mechanism that allows Node.js to perform non-blocking operations despite JavaScript being single-threaded. It works in phases:

1. **Timers** - executes setTimeout/setInterval callbacks
2. **I/O callbacks** - executes I/O operation callbacks
3. **Poll** - retrieves new I/O events
4. **Check** - executes setImmediate callbacks
5. **Close** - executes close event callbacks

When async operations complete, their callbacks are queued and the Event Loop picks them up in the appropriate phase.

---

### Q: What is the difference between process.nextTick() and setImmediate()?

**A:** `process.nextTick()` executes callbacks immediately after the current operation completes, before the Event Loop continues. `setImmediate()` executes callbacks in the next iteration of the Event Loop. If both are called, nextTick always runs first.

---

### Q: Explain streams in Node.js.

**A:** Streams are objects that let you read or write data in chunks rather than all at once. There are 4 types:

- **Readable** (read data) - `fs.createReadStream()`
- **Writable** (write data) - `fs.createWriteStream()`
- **Duplex** (both read and write) - TCP sockets
- **Transform** (modify data while reading/writing) - `zlib.createGzip()`

**Benefits:** Memory efficient for large files, can start processing before all data arrives.

---

### Q: What is middleware in Express.js?

**A:** Middleware are functions that have access to request, response, and next objects. They execute in sequence and can:

- Execute code
- Modify request/response objects
- End the request-response cycle
- Call the next middleware

```javascript
app.use((req, res, next) => {
  console.log('Request received');
  next(); // passes control to next middleware
});
```

---

### Q: What is the difference between require() and import?

**A:** 
- **require()**: CommonJS module system, synchronous, can be called anywhere in code
- **import**: ES6 module system, asynchronous, must be at the top of file, supports tree-shaking

```javascript
// CommonJS
const express = require('express');

// ES6
import express from 'express';
```

---

### Q: What is callback hell and how do you avoid it?

**A:** Callback hell occurs when multiple nested callbacks make code hard to read and maintain.

**Solutions:**
- Use Promises
- Use async/await
- Modularize code into separate functions
- Use libraries like async.js

```javascript
// Callback hell
getData(function(a) {
  getMoreData(a, function(b) {
    getEvenMoreData(b, function(c) {
      // ...
    });
  });
});

// Better with async/await
const a = await getData();
const b = await getMoreData(a);
const c = await getEvenMoreData(b);
```

---

## Async Programming

### Q: What is the difference between callbacks, promises, and async/await?

**A:**

- **Callbacks**: Functions passed as arguments, can lead to callback hell
- **Promises**: Objects representing eventual completion, chainable with .then()
- **Async/await**: Syntactic sugar over promises, makes async code look synchronous

Async/await is preferred for cleaner, more readable code.

---

### Q: How do you handle errors in async/await?

**A:** Use try-catch blocks:

```javascript
async function fetchData() {
  try {
    const data = await apiCall();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

---

### Q: What is Promise.all() and when would you use it?

**A:** `Promise.all()` takes an array of promises and returns a single promise that resolves when all promises resolve, or rejects if any promise rejects.

**Use case:** When you need to execute multiple independent async operations and wait for all to complete.

```javascript
const [users, posts, comments] = await Promise.all([
  fetchUsers(),
  fetchPosts(),
  fetchComments()
]);
```

---

### Q: What is the difference between Promise.all() and Promise.allSettled()?

**A:**
- **Promise.all()**: Fails fast - rejects immediately if any promise rejects
- **Promise.allSettled()**: Waits for all promises to settle (resolve or reject), returns array of results

```javascript
const results = await Promise.allSettled([
  promise1,
  promise2,
  promise3
]);
// Returns: [{status: 'fulfilled', value: ...}, {status: 'rejected', reason: ...}]
```

---

## Performance & Scalability

### Q: How does Node.js handle concurrency?

**A:** Node.js uses a single-threaded event-driven architecture with non-blocking I/O. It doesn't create new threads for each request. Instead, it uses the Event Loop to handle multiple operations concurrently through asynchronous callbacks.

---

### Q: What is clustering in Node.js?

**A:** Clustering allows you to create child processes (workers) that share the same server port, utilizing multiple CPU cores. The master process distributes incoming connections among workers.

```javascript
const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  const cpus = os.cpus().length;
  for (let i = 0; i < cpus; i++) {
    cluster.fork();
  }
} else {
  // Worker process runs server
  require('./server');
}
```

---

### Q: How would you improve Node.js application performance?

**A:**

- Use caching (Redis, memory cache)
- Implement clustering for multi-core usage
- Use connection pooling for databases
- Optimize database queries and add indexes
- Use compression middleware (gzip)
- Implement pagination for large datasets
- Use CDN for static assets
- Enable HTTP/2
- Use worker threads for CPU-intensive tasks
- Implement rate limiting

---

### Q: What is the difference between Worker Threads and Cluster?

**A:**
- **Cluster**: Creates multiple processes, each with its own memory and V8 instance. Good for handling multiple HTTP requests.
- **Worker Threads**: Creates threads within a single process, shares memory. Good for CPU-intensive operations.

---

### Q: How do you handle memory leaks in Node.js?

**A:**

**Common causes:**
- Global variables
- Event listeners not removed
- Closures holding references
- Large objects in cache

**Solutions:**
- Use heap snapshots and profiling tools
- Monitor with `process.memoryUsage()`
- Remove event listeners when done
- Use WeakMap/WeakSet for caches
- Implement proper cleanup in application lifecycle

---

## Database & APIs

### Q: What is connection pooling and why is it important?

**A:** Connection pooling maintains a pool of reusable database connections instead of creating new ones for each request. 

**Benefits:**
- Reduces connection overhead
- Improves performance
- Limits concurrent connections to database
- Faster response times

```javascript
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mydb',
  connectionLimit: 10
});
```

---

### Q: How do you handle authentication in Node.js?

**A:** Common approaches:

- **JWT (JSON Web Tokens)**: Stateless, token-based authentication
- **Session-based**: Store session data on server, send session ID to client
- **OAuth**: Third-party authentication (Google, Facebook)

**JWT example flow:**
1. User logs in with credentials
2. Server validates and generates JWT
3. Client stores JWT and sends it in headers for subsequent requests
4. Server verifies JWT for protected routes

```javascript
const jwt = require('jsonwebtoken');

// Generate token
const token = jwt.sign({ userId: user.id }, 'secret_key', { expiresIn: '1h' });

// Verify token
const decoded = jwt.verify(token, 'secret_key');
```

---

### Q: What is the difference between SQL and NoSQL databases? When would you use each?

**A:**

**SQL (MySQL, PostgreSQL):**
- Structured, relational data
- ACID compliance
- Complex queries with joins
- Use when: data structure is clear, need transactions, complex relationships

**NoSQL (MongoDB, Redis):**
- Flexible schema
- Horizontal scaling
- Fast read/write
- Use when: rapid development, flexible data, high scalability needs

---

### Q: How do you implement pagination in Node.js?

**A:**

```javascript
// Using MongoDB with Mongoose
async function getUsers(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  
  const users = await User.find()
    .skip(skip)
    .limit(limit);
    
  const total = await User.countDocuments();
  
  return {
    users,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalUsers: total
  };
}
```

---

### Q: How do you handle file uploads in Node.js?

**A:** Use middleware like `multer`:

```javascript
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ filename: req.file.filename });
});
```

---

## Security

### Q: What are common security best practices in Node.js?

**A:**

- Use helmet.js to set security headers
- Validate and sanitize user input
- Use parameterized queries to prevent SQL injection
- Implement rate limiting
- Keep dependencies updated (npm audit)
- Use HTTPS
- Store secrets in environment variables
- Implement proper error handling (don't expose stack traces)
- Use CSRF tokens
- Implement proper session management
- Enable CORS properly
- Use bcrypt for password hashing

---

### Q: What is CORS and how do you handle it?

**A:** Cross-Origin Resource Sharing (CORS) allows servers to specify which domains can access resources. It's a security feature implemented by browsers.

**Enable in Express:**

```javascript
const cors = require('cors');

// Allow all origins
app.use(cors());

// Allow specific origin
app.use(cors({
  origin: 'https://example.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
```

---

### Q: How do you prevent SQL injection in Node.js?

**A:**

- Use parameterized queries/prepared statements
- Use ORM/ODM libraries (Sequelize, Mongoose)
- Validate and sanitize input
- Use least privilege database accounts

```javascript
// Bad - vulnerable to SQL injection
const query = `SELECT * FROM users WHERE email = '${email}'`;

// Good - parameterized query
const query = 'SELECT * FROM users WHERE email = ?';
connection.query(query, [email], (err, results) => {
  // ...
});
```

---

### Q: How do you securely store passwords?

**A:** Use bcrypt to hash passwords with salt:

```javascript
const bcrypt = require('bcrypt');

// Hash password
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Verify password
const isMatch = await bcrypt.compare(password, hashedPassword);
```

---

### Q: What is helmet.js and why use it?

**A:** Helmet.js helps secure Express apps by setting various HTTP headers:

- X-Content-Type-Options (prevents MIME sniffing)
- X-Frame-Options (prevents clickjacking)
- X-XSS-Protection (enables XSS filter)
- Strict-Transport-Security (enforces HTTPS)

```javascript
const helmet = require('helmet');
app.use(helmet());
```

---

## Testing & Debugging

### Q: How do you debug Node.js applications?

**A:**

- Use `console.log()` for simple debugging
- Use Node.js debugger with `node inspect`
- Use Chrome DevTools with `node --inspect`
- Use debugging tools in VS Code
- Check logs and error stack traces
- Use monitoring tools (PM2, New Relic)
- Use `console.trace()` for stack traces
- Use breakpoints in IDE

---

### Q: What testing frameworks have you used?

**A:** Common frameworks:

- **Mocha/Chai**: Flexible testing framework
- **Jest**: All-in-one testing solution with built-in mocking
- **Supertest**: For testing HTTP APIs
- **Sinon**: For mocks, stubs, and spies

**Basic test structure:**

```javascript
const request = require('supertest');
const app = require('../app');

describe('User API', () => {
  it('should create a user', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: 'John', email: 'john@example.com' });
      
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
  
  it('should get all users', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
```

---

### Q: What is the difference between unit testing and integration testing?

**A:**

- **Unit Testing**: Tests individual functions/components in isolation. Fast, focused on small units of code.
- **Integration Testing**: Tests how multiple components work together. Tests database connections, API endpoints, etc.

```javascript
// Unit test
describe('calculateTotal', () => {
  it('should sum array of numbers', () => {
    expect(calculateTotal([1, 2, 3])).toBe(6);
  });
});

// Integration test
describe('POST /orders', () => {
  it('should create order and update inventory', async () => {
    const response = await request(app)
      .post('/orders')
      .send({ productId: 1, quantity: 2 });
    expect(response.status).toBe(201);
    // Verify database was updated
  });
});
```

---

### Q: How do you mock external API calls in tests?

**A:** Use libraries like `nock` or `jest.mock()`:

```javascript
const nock = require('nock');

describe('External API', () => {
  it('should fetch user data', async () => {
    nock('https://api.example.com')
      .get('/users/1')
      .reply(200, { id: 1, name: 'John' });
      
    const user = await fetchUser(1);
    expect(user.name).toBe('John');
  });
});
```

---

## Advanced Topics

### Q: What is the purpose of package.json and package-lock.json?

**A:**

- **package.json**: Contains project metadata, dependencies, scripts, and configuration
- **package-lock.json**: Locks exact versions of dependencies to ensure consistent installs across environments

---

### Q: Explain the difference between dependencies and devDependencies.

**A:**

- **dependencies**: Required for the application to run in production
- **devDependencies**: Only needed during development (testing tools, build tools, etc.)

```json
{
  "dependencies": {
    "express": "^4.18.0"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "nodemon": "^2.0.0"
  }
}
```

---

### Q: What is Environment Variables and how do you use them?

**A:** Environment variables store configuration that changes between environments (development, staging, production).

**Using dotenv:**

```javascript
// .env file
PORT=3000
DB_HOST=localhost
SECRET_KEY=mysecret

// app.js
require('dotenv').config();
const port = process.env.PORT;
```

**Never commit .env files to version control!**

---

### Q: What are some common npm scripts you use?

**A:**

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint .",
    "build": "webpack --mode production"
  }
}
```

---

### Q: What is RESTful API design?

**A:** REST (Representational State Transfer) is an architectural style for APIs.

**Principles:**
- Use HTTP methods appropriately (GET, POST, PUT, DELETE)
- Use meaningful resource URLs
- Stateless communication
- Use proper status codes

```javascript
// Good RESTful design
GET    /api/users          // Get all users
GET    /api/users/1        // Get user with ID 1
POST   /api/users          // Create new user
PUT    /api/users/1        // Update user with ID 1
DELETE /api/users/1        // Delete user with ID 1
```

---

### Q: What HTTP status codes do you commonly use?

**A:**

- **200 OK**: Successful GET, PUT, PATCH
- **201 Created**: Successful POST
- **204 No Content**: Successful DELETE
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Authenticated but not authorized
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

---

### Q: How do you handle errors globally in Express?

**A:**

```javascript
// Error handling middleware (must be last)
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Usage in routes
app.get('/user/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    res.json(user);
  } catch (error) {
    next(error); // Pass to error handler
  }
});
```

---

### Q: What is the difference between req.query, req.params, and req.body?

**A:**

- **req.params**: URL parameters (e.g., `/users/:id`)
- **req.query**: Query string parameters (e.g., `/users?age=25`)
- **req.body**: POST/PUT request body data

```javascript
// URL: /users/123?role=admin
// Body: { "name": "John" }

app.put('/users/:id', (req, res) => {
  console.log(req.params.id);    // "123"
  console.log(req.query.role);   // "admin"
  console.log(req.body.name);    // "John"
});
```

---

### Q: What is Socket.io and when would you use it?

**A:** Socket.io enables real-time, bidirectional communication between clients and servers using WebSockets.

**Use cases:**
- Chat applications
- Real-time notifications
- Live updates (stock prices, sports scores)
- Collaborative tools

```javascript
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('User connected');
  
  socket.on('message', (data) => {
    io.emit('message', data); // Broadcast to all clients
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
```

---

### Q: What is rate limiting and how do you implement it?

**A:** Rate limiting restricts the number of requests a client can make to prevent abuse.

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later'
});

app.use('/api/', limiter);
```

---

### Q: How do you implement logging in Node.js?

**A:** Use logging libraries like Winston or Morgan:

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Usage
logger.info('Server started');
logger.error('Database connection failed', { error: err });
```

---

### Q: What is the difference between PUT and PATCH?

**A:**

- **PUT**: Replaces the entire resource
- **PATCH**: Partially updates the resource

```javascript
// PUT - requires all fields
PUT /users/1
{
  "name": "John",
  "email": "john@example.com",
  "age": 30
}

// PATCH - only fields to update
PATCH /users/1
{
  "email": "newemail@example.com"
}
```

---

## Microservices & Architecture

### Q: What is a microservices architecture?

**A:** Microservices is an architectural pattern where an application is composed of small, independent services that communicate over network protocols.

**Benefits:**
- Independent deployment
- Technology diversity
- Scalability
- Fault isolation

**Challenges:**
- Increased complexity
- Network latency
- Data consistency
- Service discovery

---

### Q: How do microservices communicate with each other?

**A:**

**Synchronous:**
- REST APIs (HTTP/HTTPS)
- gRPC

**Asynchronous:**
- Message queues (RabbitMQ, Kafka)
- Event-driven architecture
- Pub/Sub patterns

---

### Q: What is PM2 and why use it?

**A:** PM2 is a production process manager for Node.js applications.

**Features:**
- Automatic restarts on crashes
- Cluster mode for load balancing
- Log management
- Monitoring
- Zero-downtime reloads

```bash
pm2 start app.js -i max  # Start with max CPU cores
pm2 restart app
pm2 stop app
pm2 logs
pm2 monit
```

---

## Final Tips

### Q: How do you stay updated with Node.js changes?

**A:**
- Follow Node.js official blog and release notes
- Read documentation regularly
- Follow Node.js on Twitter/GitHub
- Participate in Node.js communities
- Attend conferences and webinars
- Practice with new features

---

### Q: What would you do if your Node.js application is running slowly?

**A:**

**Diagnosis:**
1. Profile the application (node --prof)
2. Check memory usage
3. Analyze database queries
4. Review network calls
5. Check for blocking operations

**Solutions:**
- Optimize database queries
- Implement caching
- Use compression
- Optimize algorithms
- Use CDN for static assets
- Implement pagination
- Use clustering
- Add indexes to database

---

### Q: Describe your experience with deployment and DevOps.

**A:** (Customize based on your experience)

- Use Git for version control
- CI/CD with Jenkins/GitHub Actions/GitLab CI
- Deploy to cloud platforms (AWS, Azure, Heroku, DigitalOcean)
- Use Docker for containerization
- Environment configuration management
- Monitoring and logging (CloudWatch, Datadog)
- Database migrations and backups
- Load balancing and auto-scaling

---

## Practice Questions to Ask Back

When interviewer asks "Do you have any questions?", consider asking:

1. What is your tech stack and why did you choose it?
2. How does your team handle code reviews?
3. What does your development and deployment process look like?
4. How do you handle monitoring and logging in production?
5. What are the biggest technical challenges your team is facing?
6. What does a typical sprint/development cycle look like?
7. How do you ensure code quality and best practices?
8. What opportunities are there for learning and growth?

---

## Preparation Tips

1. **Practice coding**: Implement real projects using concepts above
2. **Review your projects**: Be ready to discuss architecture decisions
3. **Understand fundamentals**: Event loop, async programming, streams
4. **Stay current**: Know latest Node.js features and best practices
5. **System design**: Be ready for architecture discussions
6. **Mock interviews**: Practice with peers or online platforms

Good luck with your interview! 🚀
