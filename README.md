# Emotional RAG Support 💙

An AI-powered **Emotional Support & Reflection Journal Application** built using a full-stack architecture. Users can securely sign up, log in, write daily journals, and chat with an AI assistant that responds based on their emotional history using a **RAG (Retrieval-Augmented Generation)** approach.

---

## 🚀 Features

* ✅ Secure **User Authentication** (Signup & Login)
* ✅ **JWT-based Authentication**
* ✅ **Daily Emotional Journaling**
* ✅ **Persistent Journal History** (stored in database)
* ✅ **AI Chat Support Bot**
* ✅ **RAG-based Responses from Journals**
* ✅ **User-Specific Data Isolation**
* ✅ **Modern UI with React + Vite**

---

## 🧠 Tech Stack

### 🔹 Frontend

* React.js
* Vite
* JavaScript (ES6)
* HTML5 & CSS3

### 🔹 Backend

* Python
* FastAPI
* Uvicorn
* SQLite Database
* JWT Authentication
* bcrypt (Password hashing)
* Gemini API (AI Model)

---

## 📁 Project Structure

```
emotional-rag/
├── backend/
│   ├── api.py
│   ├── auth_service.py
│   ├── db_service.py
│   ├── journal_service.py
│   ├── rag_service.py
│   ├── gemini_client.py
│   ├── safety_service.py
│   ├── requirements.txt
│   ├── .env.example
│   └── data/
│       └── emotional.db
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Backend Setup

### ✅ 1. Go to Backend Folder

```bash
cd backend
```

### ✅ 2. Create Virtual Environment

```bash
python -m venv venv
```

### ✅ 3. Activate Virtual Environment (Windows)

```bash
venv\Scripts\activate
```

### ✅ 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### ✅ 5. Run Backend Server

```bash
uvicorn api:app --reload
```

Backend will run at:

```
http://127.0.0.1:8000
```

---

## ⚙️ Frontend Setup

### ✅ 1. Go to Frontend Folder

```bash
cd frontend
```

### ✅ 2. Install Dependencies

```bash
npm install
```

### ✅ 3. Run Frontend

```bash
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

## 🔐 Environment Variables

Create a `.env` file inside `backend/` and add:

```
GEMINI_API_KEY=your_api_key_here
JWT_SECRET=your_secret_key_here
```

---

## 🗄️ Database

* Uses **SQLite**
* File location: `backend/data/emotional.db`
* Stores:

  * Users
  * Journals

---

## 🤖 AI Chat + RAG Logic

* The chatbot answers based on:

  * ✅ Current message
  * ✅ User's recent journal history
* Implements **Retrieval-Augmented Generation (RAG)**

---

## ✅ Completed Functionalities

* Signup & Login ✅
* JWT Token Generation ✅
* Journal Save & History ✅
* AI Chat ✅
* User-wise data segregation ✅
* GitHub Version Control ✅

---

## 👨‍💻 Developer

**Project by:** Sheshakanthra
**Domain:** Artificial Intelligence & Machine Learning

---

## 📌 Notes

* Do NOT upload your real `.env` file to GitHub
* Always use `.env.example` for reference
* Ensure both frontend and backend run simultaneously

---

## ✅ Status

✅ Project is fully functional and deployed locally

---

✨ *This project demonstrates secure authentication, emotional AI support, and intelligent retrieval-based response generation.*
