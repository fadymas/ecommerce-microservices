🛒 E-Commerce Microservices Project

This project is a backend E-Commerce system developed using Microservices Architecture.
Each service is designed to handle a specific business responsibility and communicates with other services using REST APIs.
The entire system is containerized using Docker and managed through Docker Compose.

🎯 Project Objectives
Understand and apply Microservices Architecture
Practice service-to-service communication
Learn Docker and Docker Compose
Build a real-world E-Commerce backend system

🧩 Microservices
The system consists of four independent microservices:
1️⃣ Catalog Servic
Manages product data
Supports Create, Read, Update, and Delete (CRUD) operations
2️⃣ Cart Service
Adds and removes products from the cart
Fetches product prices from the Catalog Service
3️⃣ Order Service
Creates orders based on cart items
Tracks order status
4️⃣ Payment Service
Simulates payment confirmation (Fake Payment Gateway)
Updates payment and order status
Each microservice:
Runs independently
Has its own SQLite database
Communicates only via REST APIs

🖥 Admin Dashboard
A web-based Admin Dashboard built with HTML, CSS, and JavaScript.
Dashboard Features:
View products, carts, orders, and payments
Create new products
Add products to cart
Create orders from cart
Simulate payment using a “Pay Now” button

📍 Dashboard URL:
http://localhost:8080

🛠 Technologies Used
Node.js & Express
SQLite
Docker & Docker Compose
REST APIs
HTML, CSS, JavaScript

⚙️ Setup & Run
Step 1: Clone the Repository
git clone https://github.com/Ahmedmido111/ecommerce-microservices.git
cd ecommerce-microservices

Step 2: Run the Project
docker-compose up --build

📌 Conclusion
This project demonstrates how multiple microservices can collaborate to form a modular, scalable, and maintainable E-Commerce backend system.
It is ideal for learning backend development, distributed systems, and DevOps fundamentals.
