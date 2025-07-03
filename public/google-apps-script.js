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
  
  // Add CORS headers
  return output;
}

function getAvailableAnswers() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(ANSWERS_SHEET_NAME);
    
    // Create the sheet if it doesn't exist
    if (!sheet) {
      sheet = spreadsheet.insertSheet(ANSWERS_SHEET_NAME);
      // Add headers
      sheet.getRange(1, 1, 1, 2).setValues([['ID', 'Text']]);
      // Add sample data
      sheet.getRange(2, 1, 4, 2).setValues([
        ['1', 'First Available Option'],
        ['2', 'Second Available Option'], 
        ['3', 'Third Available Option'],
        ['4', 'Fourth Available Option']
      ]);
    }
    
    const data = sheet.getDataRange().getValues();
    
    // Skip header row and filter out empty rows
    const answers = data.slice(1).map(row => ({
      id: row[0] ? row[0].toString() : '',
      text: row[1] ? row[1].toString() : ''
    })).filter(answer => answer.id && answer.text);
    
    return createCORSResponse({ answers });
      
  } catch (error) {
    return createCORSResponse({ error: error.toString() });
  }
}

function submitResponse(name, selectedAnswerId, timestamp) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // Get or create the answers sheet
    let answersSheet = spreadsheet.getSheetByName(ANSWERS_SHEET_NAME);
    if (!answersSheet) {
      answersSheet = spreadsheet.insertSheet(ANSWERS_SHEET_NAME);
      answersSheet.getRange(1, 1, 1, 2).setValues([['ID', 'Text']]);
    }
    
    // Get or create the responses sheet
    let responsesSheet = spreadsheet.getSheetByName(RESPONSES_SHEET_NAME);
    if (!responsesSheet) {
      responsesSheet = spreadsheet.insertSheet(RESPONSES_SHEET_NAME);
      responsesSheet.getRange(1, 1, 1, 3).setValues([['Name', 'Selected Answer', 'Timestamp']]);
    }
    
    // Get the answer text before removing it
    const answersData = answersSheet.getDataRange().getValues();
    
    let selectedAnswerText = '';
    let rowToDelete = -1;
    
    for (let i = 1; i < answersData.length; i++) {
      if (answersData[i][0] && answersData[i][0].toString() === selectedAnswerId) {
        selectedAnswerText = answersData[i][1] ? answersData[i][1].toString() : '';
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

// Helper function to initialize sheets with sample data (run once)
function initializeSheets() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // Create Available Answers sheet
  let answersSheet = spreadsheet.getSheetByName(ANSWERS_SHEET_NAME);
  if (!answersSheet) {
    answersSheet = spreadsheet.insertSheet(ANSWERS_SHEET_NAME);
  }
  answersSheet.clear();
  answersSheet.getRange(1, 1, 1, 2).setValues([['ID', 'Text']]);
  answersSheet.getRange(2, 1, 5, 2).setValues([
    ['1', 'First Available Option'],
    ['2', 'Second Available Option'], 
    ['3', 'Third Available Option'],
    ['4', 'Fourth Available Option'],
    ['5', 'Fifth Available Option']
  ]);
  
  // Create Responses sheet
  let responsesSheet = spreadsheet.getSheetByName(RESPONSES_SHEET_NAME);
  if (!responsesSheet) {
    responsesSheet = spreadsheet.insertSheet(RESPONSES_SHEET_NAME);
  }
  responsesSheet.clear();
  responsesSheet.getRange(1, 1, 1, 3).setValues([['Name', 'Selected Answer', 'Timestamp']]);
}