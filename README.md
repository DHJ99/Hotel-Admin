@@ .. @@
+
+## Enterprise Backend Setup
+
+### Prerequisites
+
+- Node.js 18+ and npm
+- PostgreSQL 15+
+- OpenAI API key or Azure OpenAI access
+
+### Backend Installation
+
+1. **Navigate to backend directory:**
+   ```bash
+   cd backend
+   ```
+
+2. **Install dependencies:**
+   ```bash
+   npm install
+   ```
+
+3. **Environment Configuration:**
+   ```bash
+   cp .env.example .env
+   ```
+   
+   Update `.env` with your configuration:
+   ```env
+   # Database
+   DATABASE_URL=postgresql://username:password@localhost:5432/hotel_admin
+   
+   # JWT Secret (generate a secure random string)
+   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
+   
+   # OpenAI (choose one)
+   OPENAI_API_KEY=sk-your-openai-api-key
+   # OR Azure OpenAI
+   AZURE_OPENAI_API_KEY=your-azure-key
+   AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
+   ```
+
+4. **Database Setup:**
+   ```bash
+   # Create database
+   createdb hotel_admin
+   
+   # Run migrations
+   npm run migrate
+   ```
+
+5. **Start Backend:**
+   ```bash
+   # Development
+   npm run dev
+   
+   # Production
+   npm run build
+   npm start
+   ```
+
+### Frontend Configuration
+
+1. **Update environment variables:**
+   ```bash
+   cp .env.example .env
+   ```
+   
+   Update `.env`:
+   ```env
+   VITE_API_BASE_URL=/api
+   ```
+
+2. **Install and start frontend:**
+   ```bash
+   npm install
+   npm run dev
+   ```
+
+### API Endpoints
+
+#### Authentication
+- `POST /api/auth/register` - Register new user
+- `POST /api/auth/login` - User login
+- `GET /api/auth/profile` - Get user profile
+- `PUT /api/auth/profile` - Update user profile
+
+#### Customers
+- `GET /api/customers` - Get customers (with pagination, filters)
+- `GET /api/customers/:id` - Get specific customer
+- `POST /api/customers` - Create customer
+- `PUT /api/customers/:id` - Update customer
+- `DELETE /api/customers/:id` - Delete customer
+
+#### Bookings
+- `GET /api/bookings` - Get bookings (with pagination, filters)
+- `GET /api/bookings/:id` - Get specific booking
+- `POST /api/bookings` - Create booking
+- `PUT /api/bookings/:id` - Update booking
+- `DELETE /api/bookings/:id` - Delete booking
+
+#### Analytics
+- `GET /api/analytics` - Get analytics metrics
+- `POST /api/analytics/refresh` - Refresh analytics cache
+- `GET /api/analytics/revenue-report` - Get revenue report
+- `GET /api/analytics/occupancy-report` - Get occupancy report
+
+#### AI Chat
+- `POST /api/chat/message` - Send chat message
+- `GET /api/chat/conversations` - Get conversation list
+- `GET /api/chat/conversations/:session_id` - Get specific conversation
+- `DELETE /api/chat/conversations/:session_id` - Delete conversation
+
+### Testing
+
+```bash
+# Backend tests
+cd backend
+npm test
+
+# Frontend tests
+npm test
+```
+
+### Docker Deployment
+
+```bash
+# Build backend image
+cd backend
+docker build -t hotel-admin-backend .
+
+# Run with docker-compose (create docker-compose.yml)
+docker-compose up -d
+```
+
+### Production Deployment
+
+1. **Environment Variables:**
+   - Set `NODE_ENV=production`
+   - Use secure JWT secret
+   - Configure production database
+   - Set up proper CORS origins
+
+2. **Security:**
+   - Enable HTTPS
+   - Configure rate limiting
+   - Set up monitoring and logging
+   - Use environment secrets management
+
+3. **Database:**
+   - Use connection pooling
+   - Set up backups
+   - Configure read replicas if needed
+
+### API Testing
+
+Import the provided `postman_collection.json` into Postman or use these curl examples:
+
+```bash
+# Register user
+curl -X POST http://localhost:5000/api/auth/register \
+  -H "Content-Type: application/json" \
+  -d '{"email":"admin@luxestay.com","password":"password123","name":"Hotel Admin"}'
+
+# Login
+curl -X POST http://localhost:5000/api/auth/login \
+  -H "Content-Type: application/json" \
+  -d '{"email":"admin@luxestay.com","password":"password123"}'
+
+# Get analytics (replace TOKEN with actual JWT)
+curl -X GET http://localhost:5000/api/analytics \
+  -H "Authorization: Bearer TOKEN"
+
+# Send chat message
+curl -X POST http://localhost:5000/api/chat/message \
+  -H "Authorization: Bearer TOKEN" \
+  -H "Content-Type: application/json" \
+  -d '{"message":"What are your hotel amenities?"}'
+```
+
+### Features
+
+✅ **Real AI Integration** - OpenAI/Azure OpenAI powered chat assistant  
+✅ **Secure Authentication** - JWT-based auth with bcrypt password hashing  
+✅ **PostgreSQL Database** - Production-ready with migrations and indexing  
+✅ **Real-time Analytics** - Dynamic calculation with caching  
+✅ **Rate Limiting** - API protection against abuse  
+✅ **Input Validation** - Joi schema validation  
+✅ **Error Handling** - Comprehensive logging and error tracking  
+✅ **Mobile Responsive** - Touch-friendly UI with pull-to-refresh  
+✅ **TypeScript** - Full type safety across frontend and backend  
+✅ **Docker Ready** - Containerized deployment  
+✅ **CI/CD Pipeline** - GitHub Actions workflow  
+✅ **API Documentation** - Postman collection included  

```