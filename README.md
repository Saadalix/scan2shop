# 🛒 Scan2Shop

Scan2Shop is a **final-year project** developed using **Python Flask**, designed to provide a smart and efficient shopping experience by allowing users to scan products and retrieve relevant information instantly. The system bridges physical shopping with digital intelligence, improving user convenience and decision-making.

---

## 🚀 Project Overview

Scan2Shop enables users to:

* Scan a product (barcode / QR / image-based input)
* Retrieve product details in real time
* View pricing, add quantity, and related information
* Interact with a web-based interface powered by Flask

This project demonstrates the practical implementation of **backend development, API handling, and web application architecture** using Python.

---

## 🧠 Key Features

* 📷 Product scanning functionality
* 🔍 Real-time product information retrieval
* 🗄️ Database-driven product management
* 🌐 Web-based user interface
* 🔐 Secure and structured backend using Flask

---

## 🛠️ Technology Stack

### Backend

* **Python**
* **Flask** (Web Framework)

### Frontend

* HTML5
* CSS3
* JavaScript

### Database

* MongoDB 

### Tools & Libraries

* Flask Routing & Templates 
* REST-style request handling

---

## 🏗️ System Architecture

### High-Level Architecture

```
User (Browser)
   │
   ▼
Frontend (HTML / CSS / JS)
   │
   ▼
Flask Server (Python)
   │
   ├── Business Logic
   ├── API / Routes
   └── Authentication / Validation
   │
   ▼
Database (Product Data)
```

---

### Architecture Explanation

1. **Client Layer (Frontend)**

   * Users interact through a browser-based UI.
   * Product scans or inputs are sent to the backend via HTTP requests.

2. **Application Layer (Flask Backend)**

   * Flask handles routing, request processing, and responses.
   * Business logic processes scanned data and validates requests.
   * Communicates with the database to fetch product information.

3. **Data Layer (Database)**

   * Stores product details such as name, price, barcode, and availability.
   * Ensures persistent and structured data management.

---

## 📁 Project Structure (Example)

```
scan2shop/
├── app.py
├── requirements.txt
├── templates/
│   ├── index.html
│   └── product.html
├── static/
│   ├── css/
│   └── js/
├── database/
│   └── scan2shop.db
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Create & Activate a Virtual Environment (venv)

Using a virtual environment ensures project dependencies are isolated and reproducible.

**Create venv**

```bash
python -m venv venv
```

**Activate venv**

* **Windows**

```bash
venv\Scripts\activate
```

* **macOS / Linux**

```bash
source venv/bin/activate
```

Once activated, your terminal will show `(venv)`.

---

### 2️⃣ Clone the Repository

```bash
git clone https://github.com/Saadalix/scan2shop.git
cd scan2shop
```

---

### 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

> 💡 If `requirements.txt` does not exist yet, generate it after installing packages:

```bash
pip freeze > requirements.txt
```

---

### 4️⃣ Run the Application

```bash
python app.py
```

---

### 5️⃣ Open in Browser

```
http://127.0.0.1:5000/
```

---

## 🎓 Academic Context

* **Project Type:** Final Year Project (FYP)
* **Domain:** Web Application Development
* **Focus Areas:** Python, Flask, Backend Architecture, Database Integration

---

## 🔮 Future Enhancements

* Mobile application integration
* AI-based product recommendations
* Cloud deployment
* Advanced authentication & user roles
* Analytics dashboard for admins

---

## 👤 Author

**Saad Ali**
Software Developer | Python & Full-Stack Enthusiast

---

## 📄 License

This project is for academic and portfolio purposes.
