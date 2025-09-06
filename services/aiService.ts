import { GoogleGenerativeAI } from '@google/generative-ai';
import { AI_CONFIG, getApiKeyStatus } from '../config/aiConfig';

export interface ShopGenerationRequest {
  shopInfo: string;
}

export interface GeneratedShopData {
  shopName: string;
  description: string;
  specialties: string;
  businessHours: string;
}

export class AIService {
  private static createPrompt(shopInfo: string): string {
    return `Based on the following shop information, generate professional details for a Sri Lankan handicraft shop. Return ONLY a valid JSON object with the following structure:

{
  "shopName": "A catchy, professional shop name",
  "description": "A compelling 2-3 sentence description highlighting uniqueness and quality",
  "specialties": "Comma-separated list of 3-5 specific handicraft specialties", 
  "businessHours": "Professional business hours format (e.g., Mon-Sat: 9:00 AM - 6:00 PM)"
}

Shop Information: ${shopInfo}

Requirements:
- Keep the shop name under 50 characters
- Description should be 100-200 characters
- Specialties should reflect authentic Sri Lankan crafts
- Use professional, engaging language
- Focus on traditional craftsmanship and cultural heritage

Return only the JSON object, no additional text or formatting.`;
  }

  static async generateShopDetails(request: ShopGenerationRequest): Promise<GeneratedShopData> {
    console.log('🤖 AIService Debug - generateShopDetails called');
    console.log('🔑 API Key being used:', AI_CONFIG.GEMINI_API_KEY);
    console.log('📊 API Config:', {
      model: AI_CONFIG.MODEL_NAME,
      temperature: AI_CONFIG.TEMPERATURE,
      maxTokens: AI_CONFIG.MAX_OUTPUT_TOKENS,
      timeout: AI_CONFIG.TIMEOUT
    });
    
    // Check if API key is configured with detailed status
    const apiStatus = getApiKeyStatus();
    console.log('✅ API Key Status:', apiStatus);
    
    if (!apiStatus.isValid) {
      console.error('❌ API Key validation failed:', apiStatus.message);
      throw new Error(`API Configuration Error: ${apiStatus.message}`);
    }

    try {
      // Initialize Gemini API
      const genAI = new GoogleGenerativeAI(AI_CONFIG.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: AI_CONFIG.MODEL_NAME,
        generationConfig: {
          temperature: AI_CONFIG.TEMPERATURE,
          maxOutputTokens: AI_CONFIG.MAX_OUTPUT_TOKENS,
        }
      });

      const prompt = this.createPrompt(request.shopInfo);
      console.log('📝 Generated prompt preview:', prompt.substring(0, 200) + '...');
      
      console.log('🚀 Making API call to Google Gemini...');
      
      // Generate content with timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), AI_CONFIG.TIMEOUT)
      );
      
      const generationPromise = model.generateContent(prompt);
      const result = await Promise.race([generationPromise, timeoutPromise]) as any;
      
      console.log('📨 Received response from API');
      const response = await result.response;
      const text = response.text();
      console.log('📄 Raw API response:', text);
      
      if (!text) {
        throw new Error('No response from AI service');
      }

      // Clean and parse the JSON response
      let cleanText = text.trim();
      // Remove any markdown formatting
      cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      // Remove any extra text before or after JSON
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanText = jsonMatch[0];
      }

      const generatedData = JSON.parse(cleanText) as GeneratedShopData;
      console.log('✅ Successfully parsed JSON response:', generatedData);
      
      // Validate the response structure
      if (!generatedData.shopName || !generatedData.description || 
          !generatedData.specialties || !generatedData.businessHours) {
        console.error('❌ Invalid response structure:', generatedData);
        throw new Error('Invalid response format from AI service');
      }

      console.log('🎉 Generation completed successfully!');
      return generatedData;

    } catch (error) {
      console.error('❌ Gemini AI Service Error occurred:', error);
      console.error('❌ Error type:', typeof error);
      console.error('❌ Error constructor:', error?.constructor?.name);
      
      // Handle different types of errors with user-friendly messages
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        console.error('❌ Error message (lowercase):', errorMessage);
        
        // API key related errors
        if (errorMessage.includes('api_key_invalid') || 
            errorMessage.includes('invalid api key') ||
            errorMessage.includes('api key not valid') ||
            errorMessage.includes('unauthorized')) {
          throw new Error('Invalid API key. Please check your Google Gemini API key configuration.');
        }
        
        // Quota and rate limiting errors
        if (errorMessage.includes('quota_exceeded') || errorMessage.includes('quota exceeded')) {
          throw new Error('API quota exceeded. Please try again later.');
        }
        
        if (errorMessage.includes('rate_limit_exceeded') || errorMessage.includes('rate limit')) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        }
        
        // Network and connectivity errors
        if (errorMessage.includes('network') || 
            errorMessage.includes('connection') ||
            errorMessage.includes('timeout') ||
            errorMessage.includes('fetch')) {
          throw new Error('Network connection failed. Please check your internet connection and try again.');
        }
        
        // JSON parsing errors
        if (error instanceof SyntaxError || errorMessage.includes('json') || errorMessage.includes('parse')) {
          throw new Error('Failed to process AI response. Please try again.');
        }
        
        // Model or API errors
        if (errorMessage.includes('model') || errorMessage.includes('not found')) {
          throw new Error('AI model temporarily unavailable. Please try again later.');
        }
      }
      
      // Default error message
      throw new Error('Failed to generate shop details. Please try again or use the fallback option.');
    }
  }

  // Fallback method for when API is unavailable (same as before)
  static generateFallbackData(shopInfo: string): GeneratedShopData {
    const keywords = shopInfo.toLowerCase();
    
    let shopName = 'Heritage Crafts Lanka';
    let specialties = 'Traditional masks, Wood carving, Handwoven textiles, Gemstone jewelry';
    
    // Customize based on input keywords
    if (keywords.includes('wood')) {
      shopName = 'Master Woodcraft Lanka';
      specialties = 'Wood carving, Traditional furniture, Decorative sculptures, Handcrafted toys';
    } else if (keywords.includes('textile') || keywords.includes('fabric')) {
      shopName = 'Ceylon Textile Heritage';
      specialties = 'Handwoven textiles, Traditional batik, Embroidered goods, Silk products';
    } else if (keywords.includes('mask') || keywords.includes('dance')) {
      shopName = 'Traditional Masks Lanka';
      specialties = 'Kolam masks, Sanni masks, Dance accessories, Cultural artifacts';
    } else if (keywords.includes('gem') || keywords.includes('jewelry')) {
      shopName = 'Ceylon Gem Crafts';
      specialties = 'Gemstone jewelry, Traditional settings, Handcrafted accessories, Precious stones';
    }

    return {
      shopName,
      description: 'Authentic Sri Lankan handicrafts showcasing centuries-old traditions and exceptional craftsmanship, bringing cultural heritage to life through every handmade piece.',
      specialties,
      businessHours: 'Mon-Sat: 9:00 AM - 6:00 PM, Sun: 10:00 AM - 4:00 PM'
    };
  }
}
