# 🇮🇳 Our Voice — MGNREGA Dashboard

This project visualizes district-level data from the **Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)**.  
It allows users to explore their district’s performance in an easy-to-understand way — especially designed for low-data-literacy audiences in rural India.

---

## 🌍 Live Demo

- **Frontend (React + Vite):** [https://mgnrega-two.vercel.app/](https://mgnrega-two.vercel.app/)
- **Backend (Node.js + Express + MongoDB):** [https://mgnrega.onrender.com](https://mgnrega.onrender.com)

✅ Both are fully deployed and functional — no setup required to explore the live version.

---

# 🏗️ Backend - MGNREGA Data Visualization Project

The backend manages all MGNREGA-related data, including districts and monthly reports.  
It connects to MongoDB and provides REST APIs consumed by the frontend.

---

## 🚀 How to Run the Backend

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/PRM710/MGNREGA.git
cd backend
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Environment Variables
Create a `.env` file inside the **backend** folder:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
DATA_GOV_API_KEY=your_data_gov_api_key
DATA_GOV_API_URL=https://api.data.gov.in/resource/ee03643a-ee4c-48c2-ac30-9f2ff26ab722
```

> ⚠️ Already configured in the live deployment, so you only need this if hosting your own backend.

---

## 🧠 Database Seeding (Only if you want to add or refresh data)

### 🗺️ 1. Seed Districts (GeoJSON-based)
```bash
npm run seed:districts
```

### 📊 2. Seed Districts from CSV (for a specific state)
```bash
npm run seed:districts -- <state_short_code>
```
Example:
```bash
npm run seed:districts -- gj
```

### 💾 3. Seed MGNREGA Monthly Data
```bash
npm run seed:mgnrega -- <state_short_code>
```
Example:
```bash
npm run seed:mgnrega -- maha
npm run seed:mgnrega -- gj
npm run seed:mgnrega -- up
```

> The CSV files are located inside the `/data` folder (e.g., `gj_mgnrega_data.csv`, `maha_mgnrega_data.csv`).

---

## ▶️ Start the Backend Server
```bash
npm run dev
```
Backend runs at:
```
http://localhost:3000
```

---

## 🧩 Folder Structure

```
backend/
│
├── data/                # CSV data files
├── src/
│   ├── models/          # Mongoose models
│   ├── routes/          # Express route handlers
│   ├── seed/            # Seeder scripts
│   ├── utils/           # Utilities
│   ├── app.js           # Express app setup
│   └── server.js        # Entry point
│
├── .env
├── package.json
└── README.md
```

---

## ✅ Summary

- You **don’t need** to reseed — database already has data.
- Use seeding scripts only if adding new data.
- Run `npm run dev` to start backend locally.

---

# 💻 Frontend - MGNREGA Data Visualization Project

The frontend is built using **React + Vite**, designed for simplicity and accessibility.  
It connects to the backend API and presents data using visual charts and district filters.

---

## 🚀 How to Run the Frontend

### 1️⃣ Open New Terminal
```bash
cd frontend
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Environment Variables
Create a `.env` file in the **frontend** folder with:
```env
VITE_API_BASE=https://mgnrega.onrender.com/api/v1
```

---

## ▶️ Start the Frontend
```bash
npm run dev
```
Frontend will run at:
```
http://localhost:5173
```

---

## 🧩 Folder Structure

```
frontend/
│
├── src/
│   ├── components/      # React components
│   ├── App.jsx          # Root app
│   └── main.jsx         # Entry file
│
├── .env
├── package.json
└── README.md
```

---

## ✅ Summary

- Live frontend connects to the deployed backend API.  
- Local setup works the same — just change `.env` if hosting backend yourself.  
- Run `npm run dev` for development preview.

---

## 🎯 Final Notes

This project fulfills:
- District selection and performance visualization
- Monthly and yearly comparisons
- Backend API reliability (local + hosted)
- Scalable architecture ready for production use
