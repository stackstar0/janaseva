# Jana Seva - Digital Service Portal

A comprehensive digital service portal for government document applications and services built with Node.js, Express, and MongoDB.

## 🚀 Features

- **User Authentication**: Secure registration and login with Google OAuth integration
- **Document Services**: Apply for various government documents
  - Aadhar Card services
  - PAN Card applications
  - Income and Caste certificates
  - Xerox/photocopy services
- **Request Management**: Track application status (Pending, Ongoing, Completed)
- **Admin Dashboard**: Administrative interface for managing requests
- **File Upload**: Secure document upload functionality
- **Responsive Design**: Modern Bootstrap-based UI

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js with Google OAuth 2.0 and Local Strategy
- **File Upload**: Multer
- **Session Management**: Express Session
- **Frontend**: HTML, CSS, Bootstrap, JavaScript

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Google OAuth credentials

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/stackstar0/janaseva.git
   cd janaseva
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables in `.env`:
   ```env
   # Database
   MONGO_URI=your_mongodb_connection_string

   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   # Session Secret
   SESSION_SECRET=your_session_secret_key
   ```

4. **Google OAuth Setup**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:3000/auth/google/callback`

5. **Run the application**
   ```bash
   npm start
   ```
   
   The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
janaseva/
├── config/
│   └── passport.js          # Passport authentication configuration
├── middleware/
│   └── auth.js             # Authentication middleware
├── models/
│   ├── User.js             # User model
│   ├── CertificateApplication.js
│   ├── Request.js
│   ├── ServiceRequest.js
│   └── XeroxRequest.js
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── dashboard.js        # Dashboard routes
│   ├── aadhar.js          # Aadhar services
│   ├── pan.js             # PAN services
│   ├── certificate.js      # Certificate services
│   ├── xerox.js           # Xerox services
│   └── requests.js        # Request management
├── startbootstrap-simple-sidebar-gh-pages/  # Frontend assets
├── uploads/               # File upload directory
├── .env.example          # Environment template
├── .gitignore           # Git ignore rules
├── package.json         # Dependencies
└── server.js           # Main application file
```

## 🔧 API Endpoints

### Authentication
- `GET /auth/google` - Google OAuth login
- `GET /auth/google/callback` - OAuth callback
- `POST /auth/login` - Local login
- `POST /auth/register` - User registration
- `GET /auth/logout` - Logout

### Services
- `GET /dashboard` - User dashboard
- `POST /aadhar/apply` - Apply for Aadhar services
- `POST /pan/apply` - Apply for PAN card
- `POST /certificate/apply` - Apply for certificates
- `POST /xerox/request` - Request xerox services

### Request Management
- `GET /requests` - View all requests
- `GET /requests/:status` - Filter by status
- `PUT /requests/:id/status` - Update request status

## 🔒 Security Features

- Environment variable protection for sensitive data
- Session-based authentication
- File upload validation
- Input sanitization
- HTTPS ready configuration

## 🚀 Deployment

### Environment Setup for Production

1. Set production environment variables
2. Use a production MongoDB instance
3. Configure proper session secrets
4. Set up SSL certificates
5. Configure reverse proxy (nginx recommended)

### Deployment Platforms
- Heroku
- Railway
- DigitalOcean
- AWS EC2

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact: [your-email@example.com]

## 🙏 Acknowledgments

- Bootstrap for the UI framework
- Passport.js for authentication
- MongoDB for database services
- All contributors and testers

---

**Note**: Make sure to keep your `.env` file secure and never commit it to version control. Always use the `.env.example` template for sharing configuration structure.