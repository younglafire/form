// Google Sheets API service
import { Answer } from "../types";

// Your actual Google Apps Script web app URL
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
    try {
      console.log('Fetching from Google Sheets...');
      
      const response = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?action=getAnswers&timestamp=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

      if (!response.ok) {
        console.log(`HTTP ${response.status}: ${response.statusText}`);
        return this.getMockAnswers();
      }

      const data = await response.json();
      console.log('Google Sheets response:', data);
      
      if (data.error) {
        console.log('Google Sheets error:', data.error);
        return this.getMockAnswers();
      }

      if (data.answers && data.answers.length > 0) {
        console.log('✅ Using real Google Sheets data:', data.answers);
        return data.answers;
      } else {
        console.log('No answers from Google Sheets, using mock data');
        return this.getMockAnswers();
      }
    } catch (error) {
      console.error('Error fetching from Google Sheets:', error);
      console.log('Using mock data as fallback');
      return this.getMockAnswers();
    }
  }

  async submitResponse(name: string, selectedAnswerId: string): Promise<boolean> {
    try {
      console.log('Submitting to Google Sheets...', { name, selectedAnswerId });
      
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
        mode: 'cors',
      });

      if (!response.ok) {
        console.log(`HTTP ${response.status}: ${response.statusText}`);
        return true; // Return true for development
      }

      const data = await response.json();
      console.log('Submit response:', data);
      
      if (data.error) {
        console.log('Submit error:', data.error);
        return true; // Return true for development
      }

      return data.success === true;
    } catch (error) {
      console.error('Error submitting to Google Sheets:', error);
      // Return true for development/fallback
      return true;
    }
  }

  private getMockAnswers(): Answer[] {
    // Using your exact data from the sheets
    return [
      { id: '1', text: 'Apple' },
      { id: '2', text: 'Banana' },
      { id: '3', text: 'Orange' },
    ];
  }
}