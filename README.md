# Living Library 2.0

Welcome to Living Library 2.0, an AI-powered web application for exploring, summarizing, and discussing a rich library of resources. This platform allows users to not only consume content but also contribute their own stories, engage in discussions, and leverage the power of Google's Gemini AI for a deeper understanding.

## ✨ Features

- **Explore a Rich Library**: Browse a collection of articles and community-submitted stories.
- **Advanced Search & Filtering**: Easily find resources by searching keywords or filtering by category and tags.
- **AI-Powered Summaries**: Get concise, AI-generated summaries of any resource with a single click.
- **Interactive AI Assistant**: Chat with an intelligent AI assistant to ask questions, clarify concepts, or explore topics further.
- **Community Contributions**: Authenticated users can upload their own stories as documents (`.pdf`, `.doc`, `.txt`) or audio files (`.mp3`, `.wav`).
- **Automatic Content Processing**: The application uses the Gemini API to automatically extract text from documents, transcribe audio files, and generate relevant tags.
- **User Profiles**: Users can manage their profile information, view their submitted stories, and track their recent activity.
- **Community Engagement**: Like your favorite resources and join the discussion by posting comments.
- **Bookmarking**: Save interesting resources to a personal list for easy access later from your profile.
- **Responsive Design**: A clean, modern, and fully responsive UI that works on all devices.
- **Theming**: Switch between Light, Dark, and System themes for optimal viewing comfort.

---

## 🚀 Getting Started

This project is a React frontend application that connects directly to Google's Gemini API.

### Frontend Setup

The frontend is a React application built with TypeScript and styled with Tailwind CSS. It runs entirely in the browser and requires no build step for development, thanks to in-browser transpilation via Babel.

1.  **Set Up API Key**:
    You need to provide a Google Gemini API key for the AI features to work. This is done via an environment variable `API_KEY` that must be available in the execution environment where the app is running.

2.  **Run the application**:
    Simply serve the root directory using a static file server. All AI features will work directly in the browser.
