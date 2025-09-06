// AI Configuration - Google Gemini API
export const AI_CONFIG = {
  GEMINI_API_KEY: 'AIzaSyA6z1mSKg812YmaDchuFUuqMwmv9xiXE60', // Replace with your actual Google Gemini API key
  MODEL_NAME: 'gemini-1.5-flash', // Fast and efficient model
  TIMEOUT: 30000, // 30 seconds
  TEMPERATURE: 0.7,
  MAX_OUTPUT_TOKENS: 500,
};

// Validation function to check if API key is configured  
export const isApiKeyConfigured = (): boolean => {
  const apiKey = AI_CONFIG.GEMINI_API_KEY?.trim();
  
  // Check if API key exists and is not a placeholder
  if (!apiKey || 
      apiKey === 'YOUR_ACTUAL_API_KEY_HERE') {
    return false;
  }
  
  // Check if API key has correct format for Google AI keys
  if (!apiKey.startsWith('AIza') || apiKey.length < 35) {
    return false;
  }
  
  return true;
};

// Function to get API key status with detailed message
export const getApiKeyStatus = (): { isValid: boolean; message: string } => {
  const apiKey = AI_CONFIG.GEMINI_API_KEY?.trim();
  
  if (!apiKey) {
    return { 
      isValid: false, 
      message: 'No API key provided. Please add your Google Gemini API key to config/aiConfig.ts' 
    };
  }
  
  if (apiKey === 'YOUR_ACTUAL_API_KEY_HERE') {
    return { 
      isValid: false, 
      message: 'Please replace the placeholder API key with your actual Google Gemini API key' 
    };
  }
  
  if (!apiKey.startsWith('AIza')) {
    return { 
      isValid: false, 
      message: 'Invalid API key format. Google Gemini API keys should start with "AIza"' 
    };
  }
  
  if (apiKey.length < 35) {
    return { 
      isValid: false, 
      message: 'API key appears to be too short. Please verify your Google Gemini API key' 
    };
  }
  
  return { isValid: true, message: 'API key format appears valid' };
};