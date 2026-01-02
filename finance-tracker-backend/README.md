
---

# FinTrack Backend

FinTrack is a backend service for managing **expenses, income, and investments**, built with **Spring Boot**, **MySQL**, and **JWT-based authentication**.
It provides secure REST APIs that power the FinTrack frontend application.

---

## 🚀 Tech Stack

* **Java 17 / 21**
* **Spring Boot**

  * Spring Web
  * Spring Security
  * Spring Data JPA
* **MySQL** (Railway managed)
* **Hibernate**
* **JWT Authentication**
* **Maven**
* **Deployed on Railway** https://railway.com/dashboard

---

## 🧱 Architecture Overview

```
Frontend (Netlify)
        |
        |  REST APIs (JSON)
        v
Backend (Spring Boot - Railway)
        |
        v
MySQL Database (Railway)
```

* Stateless backend
* JWT used for authentication & authorization
* Database schema auto-managed via JPA/Hibernate

---

## 📦 Features

* User registration & authentication
* JWT-based secure APIs
* Expense tracking
* Income tracking
* Investment tracking
* MySQL persistence using JPA
* Environment-based configuration
* Production-ready deployment on Railway

---

## ⚙️ Configuration

### Environment Variables (Required)

These **must be set** in Railway (or locally for development):

```env
SPRING_DATASOURCE_URL=jdbc:mysql://mysql.railway.internal:3306/railway
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=********

JWT_SECRET=your_base64_encoded_secret
JWT_EXPIRATION_MS=86400000
```

> ❗ Secrets are **not** stored in source code.

---

## 🗂️ application.properties (Safe Config)

```properties
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect

app.jwt.secret=${JWT_SECRET}
app.jwt.expiration-ms=${JWT_EXPIRATION_MS}

app.cors.allowed-origins=http://localhost:5173,https://fintrack-prod.netlify.app
```

---

## ▶️ Run Locally

### Prerequisites

* Java 17+
* Maven
* MySQL (local or Railway)

### Steps

```bash
mvn clean package
java -jar target/finance-tracker-backend-0.0.1-SNAPSHOT.jar
```

App will start on:

```
http://localhost:8080
```

---

## 🔐 Authentication

* Authentication is handled using **JWT tokens**
* Clients must send the token in the `Authorization` header:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

## 🩺 Health Check

Spring Boot Actuator is enabled.

```http
GET /actuator/health
```

Response:

```json
{
  "status": "UP"
}
```

---

## 🌐 Deployment

* **Backend**: Railway
* **Database**: Railway MySQL
* **Frontend**: Netlify

The backend is automatically redeployed on every push to the `main` branch.

---

## 🛡️ Security Notes

* No secrets committed to GitHub
* JWT secret stored securely in Railway variables
* CORS restricted to known frontend origins
* Stateless authentication (scalable)

---

## 📌 Status

✅ Backend live
✅ Database connected
✅ JWT authentication enabled
✅ Production-ready

---


**FinTrack Backend**
Built as part of a full-stack personal finance tracking application.
https://fintrack-spring-api.up.railway.app



