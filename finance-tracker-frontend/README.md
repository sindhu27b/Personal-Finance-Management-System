
---

# FinTrack Frontend

FinTrack Frontend is a **React-based application** built with **Vite**, providing a clean UI for managing **expenses, income, investments, and reports**.
It integrates securely with the FinTrack Spring Boot backend using **JWT authentication**.

---

## 🚀 Tech Stack

* **React**
* **Vite**
* **JavaScript (ES6+)**
* **Context API**
* **Fetch API**
* **JWT Authentication**
* **Netlify (Deployment)**

---

## 🧱 Architecture Overview

```
Browser
   |
   |  HTTPS (REST APIs)
   v
React + Vite (Netlify)
   |
   v
Spring Boot Backend (Railway)
   |
   v
MySQL Database
```

* Frontend is **stateless**
* Auth state handled via **React Context**
* API base URL injected at build time

---

## 📂 Project Structure

```
finance-tracker-frontend/
├─ public/
├─ src/
│  ├─ auth/
│  │  └─ AuthContext.jsx        # Global auth state & JWT handling
│  │
│  ├─ components/
│  │  ├─ NavBar.jsx             # Navigation bar
│  │  └─ ProtectedRoute.jsx     # Route guard for authenticated pages
│  │
│  ├─ pages/
│  │  ├─ Dashboard.jsx
│  │  ├─ Expenses.jsx
│  │  ├─ Income.jsx
│  │  ├─ Investments.jsx
│  │  ├─ Reports.jsx
│  │  ├─ Login.jsx
│  │  └─ Register.jsx
│  │
│  ├─ api.jsx                   # Centralized API helper
│  ├─ App.jsx                   # App routes & layout
│  ├─ main.jsx                  # React entry point
│  ├─ App.css
│  └─ index.css
│
├─ .env                         # Local environment variables (not committed)
├─ index.html
├─ package.json
├─ vite.config.js
└─ README.md
```

---

## 🔐 Authentication Flow

1. User logs in or registers
2. Backend returns a **JWT**
3. JWT stored in browser storage
4. `AuthContext` manages login/logout state
5. Protected routes enforced via `ProtectedRoute`
6. API requests send token:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

## 🔗 API Configuration

### `src/api.jsx`

```js
const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080'
```

* Uses environment variable in production
* Falls back to localhost for development

---

## ⚙️ Environment Variables

### Local Development (`.env`)

```env
VITE_API_BASE=http://localhost:8080
```

---

### Production (Netlify)

In **Netlify → Site Settings → Environment Variables**:

```
VITE_API_BASE=https://hopeful-rejoicing-production.up.railway.app
```

After updating env vars, **redeploy is required**.

---

## ▶️ Run Locally

### Prerequisites

* Node.js 18+
* npm

### Steps

```bash
npm install
npm run dev
```

App runs at:

```
http://localhost:5173
```

---

## 🛡️ Route Protection

Routes requiring authentication are wrapped with:

```jsx
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

Unauthenticated users are redirected to the login page.

---

## 🌍 CORS Compatibility

The backend allows requests from:

```
http://localhost:5173
https://fintrack-prod.netlify.app
```

Ensuring safe cross-origin communication.

---

## 🚀 Build & Deployment

### Build locally

```bash
npm run build
```

### Netlify settings

* **Build Command**: `npm run build`
* **Publish Directory**: `dist`
* **Environment Variables**: Managed via Netlify UI

Every push to `main` triggers an automatic redeploy.

---

## 🛡️ Security Notes

* No secrets in source code
* Backend URL injected via environment variables
* JWT used for authenticated requests
* HTTPS enforced in production

---

## 📌 Status

✅ Frontend live
✅ Auth flow implemented
✅ Connected to Railway backend
✅ Production-ready

---


**FinTrack Frontend**
Part of the FinTrack full-stack personal finance tracking application. 
frontend: https://fintrack-prod.netlify.app/
Backend:https://fintrack-spring-api.up.railway.app



