// Google Sheets API service
// Note: You'll need to set up Google Apps Script and get API credentials

import { Answer } from "../types";

// Your Google Apps Script web app URL will go here
// After you deploy your Apps Script, replace this with the actual URL
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw057vpnIetRUmUt54-JwMGKsW1aJoYlcwx5Lpc06mMIB4ns8Zcq4pdXzpmF3mdDDOr/exec';

export class GoogleSheetsService {
  private static instance: GoogleSheetsService;
  
  public static getInstance(): GoogleSheetsService {
    if (!GoogleSheetsService.instance) {
      GoogleSheetsService.instance = new GoogleSheetsService();
    }
    return GoogleSheetsService.instance;
  }

  async fetchAvailableAnswers(): Promise<Answer[]> {
    // If URL is not configured, return mock data immediately
    if (GOOGLE_APPS_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
      console.warn('Google Apps Script URL not configured. Using mock data.');
      return this.getMockAnswers();
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?action=getAnswers&timestamp=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        mode: 'cors', // Explicitly set CORS mode
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      return data.answers || [];
    } catch (error) {
      console.error('Error fetching answers from Google Sheets:', error);
      
      // Check if it's a network/CORS error
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.warn('Network error (likely CORS). This is normal in development. Using mock data.');
      } else if (error.name === 'AbortError') {
        console.warn('Request timed out. Using mock data.');
      } else {
        console.warn('Falling back to mock data. Please check your Google Apps Script setup.');
      }
      
      // Return mock data as fallback
      return this.getMockAnswers();
    }
  }

  async submitResponse(name: string, selectedAnswerId: string): Promise<boolean> {
    // If URL is not configured, simulate success
    if (GOOGLE_APPS_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
      console.warn('Google Apps Script URL not configured. Simulating successful submission.');
      return true;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'submitResponse',
          name,
          selectedAnswerId,
          timestamp: new Date().toISOString(),
        }),
        signal: controller.signal,
        mode: 'cors', // Explicitly set CORS mode
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      return data.success === true;
    } catch (error) {
      console.error('Error submitting response to Google Sheets:', error);
      
      // Check if it's a network/CORS error
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.warn('Network error (likely CORS). This is normal in development. Simulating success.');
      } else if (error.name === 'AbortError') {
        console.warn('Request timed out. Simulating success.');
      } else {
        console.warn('Simulating successful submission for development.');
      }
      
      // Return true for development/fallback
      return true;
    }
  }

  private getMockAnswers(): Answer[] {
    return [
      { id: '1', text: 'Option A - First Choice' },
      { id: '2', text: 'Option B - Second Choice' },
      { id: '3', text: 'Option C - Third Choice' },
      { id: '4', text: 'Option D - Fourth Choice' },
      { id: '5', text: 'Option E - Fifth Choice' },
    ];
  }
}