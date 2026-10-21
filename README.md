# BLF Property

A full-stack property management system built with React.js and Node.js.

## Features

- **Property Listings**: Browse and search properties
- **User Authentication**: Login/Register for buyers and sellers
- **Admin Dashboard**: Complete admin panel for property and user management
- **Property Management**: Add, edit, approve/reject properties
- **Team Management**: Team member profiles with image uploads
- **Contact System**: Contact form with admin management
- **Rental Properties**: Dedicated rental property management
- **Image Upload**: Property and team member image handling
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Context API for state management
- React Router for navigation

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads
- bcryptjs for password hashing

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Git

### Clone Repository
```bash
git clone https://github.com/sannikumar85/eazy_property_solution.git
cd eazy_property_solution
```

### Backend Setup
```bash
cd backend
npm install

# Create .env file with your MongoDB URI
# Copy .env.example to .env and update values
cp .env.example .env

# Start backend server
npm start
```

### Frontend Setup
```bash
cd frontend
npm install

# Start frontend development server
npm start
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
PORT=5001
DEFAULT_ADMIN_EMAIL=admin@example.com
DEFAULT_ADMIN_PASSWORD=replace_with_a_unique_password
GOOGLE_CLIENT_ID=your_google_oauth_web_client_id
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

The server creates an initial admin account only when both admin variables are set. Use a unique password and keep these values out of source control. Run `node seedDatabase.js --admin-only` from the backend directory to create or reset the configured admin account without reseeding sample data.

To enable Google sign-in, create a Google OAuth **Web application** client ID and set it as `GOOGLE_CLIENT_ID` in `backend/.env`. The frontend loads this public client ID from the backend at runtime, so no frontend environment variable is needed. Add the frontend origin (for example, `http://localhost:3000`) to the OAuth client's authorized JavaScript origins. The server verifies Google ID tokens; a client secret is not required.

Property photos and team profile images are uploaded to Cloudinary using the three Cloudinary variables above. The backend stores Cloudinary secure image URLs and public IDs in MongoDB, keeps uploads in memory rather than on the server's local disk, and removes newly uploaded images if the database write fails. Keep the Cloudinary API secret only in `backend/.env`, never commit environment backup files, and restart the backend after changing credentials. Image uploads accept JPEG, PNG, GIF, and WebP files up to 10 MB each.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Sign in or register with a verified Google account
- `GET /api/auth/profile` - Get user profile

### Properties
- `GET /api/properties` - Get all properties
- `POST /api/properties` - Add new property
- `GET /api/properties/:id` - Get property by ID

### Admin
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/properties` - Manage properties
- `POST /api/admin/properties` - Create property (admin)
- `PATCH /api/admin/properties/:id/approve` - Approve property
- `PATCH /api/admin/properties/:id/reject` - Reject property

### Contact
- `POST /api/contact/submit` - Submit contact form
- `GET /api/contact/types` - Get inquiry types

## Project Structure

```
eazy_property_solution/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
└── README.md
```

## Features Overview

### User Features
- Property search and filtering
- Property detail views
- User registration and authentication
- Property submission for sellers
- Contact form for inquiries

### Admin Features
- Complete dashboard with analytics
- Property approval/rejection system
- User management
- Contact inquiry management
- Team member management
- Rental property management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

**Sanni Kumar Gupta**
- Email: sannikumargupta43@gmail.com
- GitHub: [@sannikumar85](https://github.com/sannikumar85)

## Acknowledgments

- Built with React.js and Node.js
- Uses MongoDB for data storage
- Styled with Tailwind CSS
- File uploads handled with Multer