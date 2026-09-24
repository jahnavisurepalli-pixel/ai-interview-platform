# AI Technical Evaluator & Interview Proctoring Platform

An advanced, production-ready full-stack AI evaluation workspace built for higher education institutions. This application enables engineering faculty to conduct rigorous, turn-by-turn technical interview simulations while monitoring candidate integrity via automated live proctoring vectors.

## 🚀 Core Features

### 1. Candidate Verification Terminal
* **Dynamic Authentication**: Eliminates static testing placeholders. Requires candidates to verify their Full Name and Academic Roll Number prior to unlocking the testing grid workspace.
* **Live Profile Binding**: Maps candidate data instantly across the active evaluation cycle and webcam video overlay components.

### 2. Standalone Keyword Assessment Engine
* **Deterministic Tracking Layer**: Runs entirely local within a Python FastAPI environment—**zero external API keys or cloud network connections required**.
* **Adaptive Turn-by-Turn Routing**: Dynamically scans candidate syntax for key low-level engineering constructs (`malloc`, `free`, `realloc`, `pointer`, `heap`, `contiguous`). 
* **Dynamic Feedback Delivery**: Serves advanced hardware-level edge cases to high-performing responses while redirecting superficial answers to core fundamentals.

### 3. Automated Security Proctoring System
* **Integrity Monitoring Hooks**: Utilizes native browser event listeners (`visibilitychange` and `blur`) to catch tab switching, minimized browser windows, or workspace defection.
* **Live In-Stream Alerts**: Instantly prints visual security warnings within the candidate's view and logs aggregated incident values.
* **Time-Out Protection**: Keeps sessions moving forward with an automated 60-second response countdown clock that automatically submits fallback event flags upon expiration.

### 4. Faculty Administration Dashboard
* **Real-Time Data Feed**: Directly communicates with a Cloud Supabase architecture to fetch aggregated data indices.
* **Automated Data Exporter**: Compiles records instantly into downloadable spreadsheet formatting via a standalone client `.CSV` exporter utility block.

---

## 🏗️ Architecture Stack

* **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Lucide Icons.
* **Backend**: Python 3.10+, FastAPI, Uvicorn, Pydantic.
* **Database**: Cloud Supabase (PostgreSQL tables synced live).

---

## 🛠️ Step-by-Step Installation & Local Setup

Follow these quick commands to spin up the full production workspace locally:

### 1. Prerequisites
Ensure you have the following packages installed on your system terminal:
* **Node.js** (v18.0 or later)
* **Python** (v3.10 or later)

### 2. Environment Variables Setup
Create a `.env.local` file inside the root directory and connect your database tracking configuration lines:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_public_key
```

### 3. Initialize the Python FastAPI Service
Open a separate execution terminal prompt pointing to your backend application location:
```bash
# Navigate to the backend directory
cd ai-interview-backend

# Spin up the standalone engine server on local port 8000
uvicorn main:app --reload --port 8000
```

### 4. Launch the Next.js Frontend Framework
Open an independent command terminal workspace pointing to the main project root environment:
```bash
# Install required node modules and library dependencies
npm install

# Boot up the development workspace instance on local port 3000
npm run dev
```
Open your internet browser window and navigate straight to: `http://localhost:3000/student/interview`

---

## 📊 Database Schema Matrix

Data rows are written out live to a `interview_scores` relational table containing these columns:
* `id` (uuid, primary key)
* `student_name` (text)
* `roll_number` (text)
* `topic_title` (text)
* `score_percentage` (int8)
* `evaluation_status` (text) -> Automatically flagged as `Flagged` if technical grade is \(< 50\%\) or security violation metrics are logged.
* `created_at` (timestamptz)

---

## 📜 Capstone Development Attributions
Developed by **Jahnavi Surepalli** as part of the final course submission analysis module for the Artificial Intelligence program under **Youth Empowerment India**.
