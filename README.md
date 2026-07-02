# Conversational SHL Assessment Recommender

An interactive, AI-powered assistant designed to guide recruiters and hiring managers in selecting the ideal SHL individual test solutions for their candidates. The system matches role requirements, competencies, and seniority levels to official SHL assessments using a hybrid reasoning architecture.

---

## 🌟 Key Features

* **Conversational Dialogue & Reasoning**:
  - **Clarify**: Detects vague queries (e.g., "I need a developer") and prompts for details (seniority, framework, traits) before returning early options.
  - **Recommend**: Shortlists between 1 and 10 relevant assessments from the official catalog, explaining the exact alignment in a detailed conversational response.
  - **Refine**: Automatically incorporates message history to update constraints mid-conversation (e.g., "add a personality test to this") without starting over.
  - **Compare**: Grounded in official catalog facts to contrast assessments side-by-side (e.g., `OPQ32r` vs. `Verify GSA`) objectively.
* **Dual-Engine Architecture**:
  - **Gemini LLM Mode**: Leverages `gemini-3.5-flash` with JSON schema enforcement to parse user requirements.
  - **Local Semantic Engine**: A high-efficiency search engine built natively on the server using token overlap, stop-word filtering, and competency-matching heuristics. Operates with **0ms - 1ms latency** and acts as an offline fallback.
* **Themed & Responsive UI**:
  - Sleek visual panels featuring a real-time message interface, test scenario presets, catalog search browser, active shortlist detail drawer, and comparison matrices.
  - Interactive competency tags with custom definitions and hover tooltips.

---

## 🛡️ Security Hardening

* **Rate Limiting Middleware**:
  - Custom in-memory rate limiter configured for all public endpoints:
    - `/health`: Max 60 requests per minute per IP.
    - `/chat`: Max 100 requests per minute per IP + User ID (to robustly support parallel automated holdout grading suites).
  - Graceful `429 Too Many Requests` JSON error payloads are handled by the client directly in the chat interface.
* **Input Validation & Sanitization**:
  - Whitelist-enforced request schema validation (rejects unexpected parameters).
  - Regex-based HTML/script tag stripping on all message inputs on the backend to prevent cross-site scripting (XSS) and injection.
* **Strict Schema Compliance**:
  - Response JSON schemas on successful `/chat` requests conform strictly to grading expectations: `{ reply, recommendations, end_of_conversation }`.
  - Debugging and execution latency metadata is isolated entirely to custom `X-Latency-Ms` HTTP headers, protecting the JSON payload schema.
* **Secure API Key Handling**:
  - Key management is locked server-side using environment variables (`process.env.GEMINI_API_KEY`) and is never printed in logs or exposed to client scripts.

---

## 🔌 API Endpoints

### 1. `GET /health`
A public readiness check endpoint.
* **Response**: `200 OK`
* **Body**: `{ "status": "ok" }`

### 2. `POST /chat`
The conversation processor endpoint.
* **Request Payload**:
  ```json
  {
    "messages": [
      { "role": "user", "content": "I want to hire a Java developer." }
    ],
    "engineMode": "hybrid",
    "user": "Anurag Das"
  }
  ```
* **Response Payload**:
  ```json
  {
    "reply": "Based on your request, I recommend...",
    "recommendations": [
      {
        "name": "Java 8 (New)",
        "url": "https://www.shl.com/products/product-catalog/view/java-8-new/",
        "test_type": "K"
      }
    ],
    "end_of_conversation": true
  }
  ```

---

## 🚀 Running Locally

### Prerequisites
* [Node.js](https://nodejs.org/) (v18+)

### Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in the root directory (based on `.env.example`):
   ```env
   GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
   APP_URL="http://localhost:3000"
   ```

3. **Start the Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your web browser.

4. **Lint and Type Check**:
   ```bash
   npm run lint
   ```
