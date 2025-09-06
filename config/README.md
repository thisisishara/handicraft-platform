# AI Configuration Setup

This guide explains how to configure your Google Gemini API key for the AI shop details generation feature.

## Setup Instructions

1. **Get Your Google Gemini API Key:**
   - Visit [Google AI Studio](https://makersuite.google.com)
   - Sign up for a free account
   - Create a new API key
   - Copy your API key (starts with `AIza`)

2. **Configure the API Key:**
   - Open `config/aiConfig.ts`
   - Replace the placeholder API key with your actual API key
   - Save the file

   ```typescript
   export const AI_CONFIG = {
     GEMINI_API_KEY: 'AIzaSy...', // ← Replace with your actual key
     // ... other config remains the same
   };
   ```

3. **Security Notes:**
   - Never commit your actual API key to version control
   - Consider using environment variables for production
   - The API key is configured server-side, users won't see it

## Configuration Options

You can customize the AI behavior by modifying these values in `aiConfig.ts`:

- `GEMINI_API_KEY`: Your API key from Google Gemini
- `MODEL_NAME`: AI model to use (default: 'gemini-1.5-flash')
- `TEMPERATURE`: Creativity level (0.0 - 1.0, default: 0.7)
- `MAX_TOKENS`: Maximum response length (default: 500)
- `TIMEOUT`: Request timeout in milliseconds (default: 30000)

## Usage

Once configured, users can:
1. Go to **Seller Profile → Profile Details**
2. Click **"✨ Generate with AI"** in the Shop Information section
3. Describe their handicraft business
4. Get professional shop details generated automatically

## Fallback Behavior

If the API key is not configured or the API fails:
- Users will get a template-based generation option
- No functionality is lost, just uses predefined templates instead of AI
