/**
 * Google Apps Script for handling form submissions and managing sheets
 * 
 * Setup Instructions:
 * 1. Create a new Google Apps Script project at script.google.com
 * 2. Replace the default code with this script
 * 3. Update the SPREADSHEET_ID constant below with your sheet ID: 1yiDxCaNusnf7d7GfDKp_zG9GyR35OEzpCxbi1xt5sF4
 * 4. Create two sheets in your spreadsheet:
 *    - "Available Answers" with columns: ID, Text
 *    - "Responses" with columns: Name, Selected Answer, Timestamp
 * 5. Deploy as a web app with execute permissions for "Anyone"
 * 6. Copy the web app URL to src/services/googleSheets.ts
 */

// UPDATE THIS WITH YOUR ACTUAL SPREADSHEET ID
const SPREADSHEET_ID = '1yiDxCaNusnf7d7GfDKp_zG9GyR35OEzpCxbi1xt5sF4';
const ANSWERS_SHEET_NAME = 'Available Answers';
const RESPONSES_SHEET_NAME = 'Responses';

function doGet(e) {
  try {
    const action = e.parameter.action;
    
    if (action === 'getAnswers') {
      return getAvailableAnswers();
    }
    
    // Return CORS-enabled error response
    return createCORSResponse({ error: 'Invalid action' });
  } catch (error) {
    return createCORSResponse({ error: error.toString() });
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    if (action === 'submitResponse') {
      return submitResponse(data.name, data.selectedAnswerId, data.timestamp);
    }
    
    return createCORSResponse({ error: 'Invalid action' });
      
  } catch (error) {
    return createCORSResponse({ error: error.toString() });
  }
}

function createCORSResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

function getAvailableAnswers() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(ANSWERS_SHEET_NAME);
    
    if (!sheet) {
      return createCORSResponse({ error: 'Available Answers sheet not found' });
    }
    
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return createCORSResponse({ answers: [] });
    }
    
    // Skip header row and process data
    const answers = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const id = row[0] ? row[0].toString().trim() : '';
      const text = row[1] ? row[1].toString().trim() : '';
      
      // Only include rows that have both ID and text
      if (id && text) {
        answers.push({
          id: id,
          text: text
        });
      }
    }
    
    return createCORSResponse({ answers });
      
  } catch (error) {
    return createCORSResponse({ error: error.toString() });
  }
}

function submitResponse(name, selectedAnswerId, timestamp) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // Get the answers sheet
    let answersSheet = spreadsheet.getSheetByName(ANSWERS_SHEET_NAME);
    if (!answersSheet) {
      throw new Error('Available Answers sheet not found');
    }
    
    // Get the responses sheet
    let responsesSheet = spreadsheet.getSheetByName(RESPONSES_SHEET_NAME);
    if (!responsesSheet) {
      throw new Error('Responses sheet not found');
    }
    
    // Get the answer text before removing it
    const answersData = answersSheet.getDataRange().getValues();
    
    let selectedAnswerText = '';
    let rowToDelete = -1;
    
    // Find the answer to remove
    for (let i = 1; i < answersData.length; i++) {
      const cellId = answersData[i][0] ? answersData[i][0].toString().trim() : '';
      if (cellId === selectedAnswerId.toString().trim()) {
        selectedAnswerText = answersData[i][1] ? answersData[i][1].toString().trim() : '';
        rowToDelete = i + 1; // +1 because sheet rows are 1-indexed
        break;
      }
    }
    
    if (!selectedAnswerText) {
      throw new Error('Answer not found or already taken');
    }
    
    // Add response to responses sheet
    responsesSheet.appendRow([name, selectedAnswerText, timestamp]);
    
    // Remove the selected answer from available answers
    if (rowToDelete > 1) { // Make sure we don't delete the header
      answersSheet.deleteRow(rowToDelete);
    }
    
    return createCORSResponse({ success: true });
      
  } catch (error) {
    return createCORSResponse({ error: error.toString() });
  }
}

// Helper function to test the connection
function testConnection() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const answersSheet = spreadsheet.getSheetByName(ANSWERS_SHEET_NAME);
    const responsesSheet = spreadsheet.getSheetByName(RESPONSES_SHEET_NAME);
    
    console.log('✅ Spreadsheet found');
    console.log('✅ Available Answers sheet:', answersSheet ? 'found' : 'NOT FOUND');
    console.log('✅ Responses sheet:', responsesSheet ? 'found' : 'NOT FOUND');
    
    if (answersSheet) {
      const data = answersSheet.getDataRange().getValues();
      console.log('Available answers data:', data);
    }
    
    return 'Connection test successful';
  } catch (error) {
    console.error('Connection test failed:', error);
    return 'Connection test failed: ' + error.toString();
  }
}