# SkillTrade: Hyper-Local Skill Swap Platform

**SkillTrade** is a community-driven web application designed to connect local neighbors and remote freelancers. It facilitates the exchange of skills and services using a standardized "Credit" system, effectively solving the "coincidence of wants" problem inherent in direct bartering.

## 🚀 Mission

To build stronger, more skilled communities by allowing members to trade value (e.g., "I'll teach you Guitar") for credits, which can then be spent on other needs (e.g., "I need a Plumber"), without the barrier of currency.

---

## ✨ Key Features

### 1. **Discovery & Smart Matching**
*   **Hyper-Local Filtering:** Users can filter requests based on distance (miles) or search by keywords.
*   **AI-Powered Reverse Matching:** Using **Google Gemini**, the app analyzes your offered skills against public requests to generate "Smart Matches," explaining *why* you are a good fit for a specific task.
*   **Tab Views:**
    *   *Discover:* Find people who need help.
    *   *Smart Matches:* AI-curated list of people who need what you have.
    *   *My Posts:* Manage your active listings.

### 2. **AI-Enhanced Posting**
*   **Request/Offer Creation:** Simple toggle to either "Need Help" or "Offer Skills".
*   **AI Polish:** Integrated **Gemini AI** button to rewrite and enhance job descriptions to be more professional and engaging.
*   **Skill Tagging:** Categorize posts for better searchability.

### 3. **Real-Time Messaging System**
*   **Simulated WebSockets:** Experience a reactive chat interface with typing indicators, online status, and auto-scrolling.
*   **Auto-Replies:** For demo purposes, the mock users are programmed to "read" and "reply" to your messages automatically.
*   **Searchable History:** Filter through active conversations by name or message content.

### 4. **User Profiles & Reputation**
*   **Credit System:** Visual tracking of earned credits.
*   **Skills Matrix:** Clearly displayed lists of "Skills Offered" vs. "Skills Needed".
*   **Reputation:** Star ratings and review counts to build trust within the community.

### 5. **Responsive Design**
*   **Cross-Device Support:** Fully optimized for Mobile (bottom navigation, touch-friendly) and Desktop (top navigation, split-screen chat).
*   **Modern UI:** Built with **Tailwind CSS** for a clean, accessible, and aesthetic interface.

---

## 🛠 Tech Stack

*   **Frontend Framework:** React 19
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **Routing:** React Router DOM
*   **Icons:** Lucide React
*   **Artificial Intelligence:** Google GenAI SDK (`@google/genai`)
    *   Model: `gemini-2.5-flash`

---

## 📂 Project Structure

```
/
├── components/       # Reusable UI components
│   ├── Navbar.tsx    # Responsive navigation (Top for Desktop, Bottom for Mobile)
│   └── SkillBadge.tsx# Consistent pill-shaped badges for skills
├── pages/            # Main Application Views
│   ├── Home.tsx      # Dashboard, Search, and Smart Matching
│   ├── Messages.tsx  # Chat interface with simulated real-time logic
│   ├── PostRequest.tsx # Form to create new listings with AI tools
│   └── Profile.tsx   # User details and stats
├── services/
│   ├── geminiService.ts # API calls to Google Gemini
│   └── mockData.ts      # Hardcoded data for MVP demonstration
├── types.ts          # TypeScript interfaces (User, TradeRequest, Chat)
├── App.tsx           # Main router configuration
└── index.html        # Entry point with Import Map
```

---

## 🤖 AI Integration Details

The application leverages the **Google Gemini API** (`gemini-2.5-flash`) for two specific high-value features:

1.  **Description Enhancement (`enhanceDescription`)**:
    *   Takes a rough user input (e.g., "fix leak").
    *   Returns a polished version (e.g., "Experienced plumber needed to repair a kitchen sink leak...").

2.  **Smart Match Reasoning (`getSmartMatchReasoning`)**:
    *   Analyzes the current user's *Skills Offered*.
    *   Analyzes a target *Request*.
    *   Generates a one-sentence "Reasoning" displayed in the UI (e.g., *"Good Match: You offer Guitar Lessons and this user is looking for a music tutor."*).

---

## 🚀 How to Run

1.  **Dependencies:**
    This project uses ES Modules via CDN (`esm.sh`) in `index.html`. No complex build step (Webpack/Vite) is strictly required for this specific version, though a local static server is recommended.

2.  **Start:**
    Serve the root directory using a static server.
    ```bash
    npx serve .
    ```

---

## 🔮 Future Roadmap

*   **Backend Integration:** Replace `mockData.ts` with a real database (Supabase/Firebase).
*   **Auth:** Implement real user authentication.
*   **Geo-Location:** Use real browser Geolocation API to calculate distances.
*   **Transaction History:** Log credit transfers on the ledger.
