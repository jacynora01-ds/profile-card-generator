# profile-card-generator
A dynamic User Profile Card Generator using Node.js, Express and MongoDB.
# Profile Studio – User Profile Card Generator

A full-stack web application that allows users to create professional digital profile cards by entering their personal information, skills, social media links, and profile picture.

## 🌐 Live Demo

https://profile-card-generator-1-76ck.onrender.com/

## ✨ Features

- Create professional profile cards.
- Enter name, biography, and skills.
- Upload profile pictures.
- View a live profile preview.
- Automatically generate an avatar when no picture is uploaded.
- Add LinkedIn, GitHub, and Instagram links.
- Store profile information in MongoDB.
- Upload and store images using Cloudinary.
- Responsive and modern user interface.

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas
- Mongoose

### Image Storage
- Cloudinary
- Multer

### Deployment
- Render
- GitHub

## 📁 Project Structure

```text
profile-card-generator/
│
├── config/
│   └── cloudinary.js
│
├── models/
│   └── profile.js
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
