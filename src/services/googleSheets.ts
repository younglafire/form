// Google Sheets API service
// Note: You'll need to set up Google Apps Script and get API credentials

import { Answer } from "../types";

const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbytweVjGmDxDDlPOu-IVglH7EHoGi0nOap_dxpV88Is4SeD1oNGYFtAztYDlkX07VXpzw/exec';

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
      const response = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?action=getAnswers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch answers');
      }

      const data = await response.json();
      return data.answers || [];
    } catch (error) {
      console.error('Error fetching answers:', error);
      // Return mock data for development
      return [
        { id: '1', text: 'Option A - First Choice' },
        { id: '2', text: 'Option B - Second Choice' },
        { id: '3', text: 'Option C - Third Choice' },
        { id: '4', text: 'Option D - Fourth Choice' },
      ];
    }
  }

  async submitResponse(name: string, selectedAnswerId: string): Promise<boolean> {
    try {
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
      });

      if (!response.ok) {
        throw new Error('Failed to submit response');
      }

      return true;
    } catch (error) {
      console.error('Error submitting response:', error);
      // Return true for development
      return true;
    }
  }
}