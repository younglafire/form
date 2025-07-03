/**
 * Google Apps Script for handling form submissions and managing sheets
 * 
 * Setup Instructions:
 * 1. Create a new Google Apps Script project at script.google.com
 * 2. Replace the default code with this script
 * 3. Create two Google Sheets:
 *    - "Available Answers" sheet with columns: ID, Text
 *    - "Responses" sheet with columns: Name, Selected Answer, Timestamp
 * 4. Update the SPREADSHEET_ID constant below with your sheet ID
 * 5. Deploy as a web app with execute permissions for "Anyone"
 * 6. Copy the web app URL to src/services/googleSheets.ts
 */

const SPREADSHEET_ID = '1yiDxCaNusnf7d7GfDKp_zG9GyR35OEzpCxbi1xt5sF4';
const ANSWERS_SHEET_NAME = 'Available Answers';
const RESPONSES_SHEET_NAME = 'Responses';

function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'getAnswers') {
    return getAvailableAnswers();
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({ error: 'Invalid action' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    if (action === 'submitResponse') {
      return submitResponse(data.name, data.selectedAnswerId, data.timestamp);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ error: 'Invalid action' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getAvailableAnswers() {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(ANSWERS_SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    
    // Skip header row
    const answers = data.slice(1).map(row => ({
      id: row[0].toString(),
      text: row[1]
    })).filter(answer => answer.text); // Filter out empty rows
    
    return ContentService
      .createTextOutput(JSON.stringify({ answers }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function submitResponse(name, selectedAnswerId, timestamp) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // Get the answer text before removing it
    const answersSheet = spreadsheet.getSheetByName(ANSWERS_SHEET_NAME);
    const answersData = answersSheet.getDataRange().getValues();
    
    let selectedAnswerText = '';
    let rowToDelete = -1;
    
    for (let i = 1; i < answersData.length; i++) {
      if (answersData[i][0].toString() === selectedAnswerId) {
        selectedAnswerText = answersData[i][1];
        rowToDelete = i + 1; // +1 because sheet rows are 1-indexed
        break;
      }
    }
    
    if (!selectedAnswerText) {
      throw new Error('Answer not found or already taken');
    }
    
    // Add response to responses sheet
    const responsesSheet = spreadsheet.getSheetByName(RESPONSES_SHEET_NAME);
    responsesSheet.appendRow([name, selectedAnswerText, timestamp]);
    
    // Remove the selected answer from available answers
    answersSheet.deleteRow(rowToDelete);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
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
  answersSheet.getRange(2, 1, 4, 2).setValues([
    ['1', 'First Available Option'],
    ['2', 'Second Available Option'], 
    ['3', 'Third Available Option'],
    ['4', 'Fourth Available Option']
  ]);
  
  // Create Responses sheet
  let responsesSheet = spreadsheet.getSheetByName(RESPONSES_SHEET_NAME);
  if (!responsesSheet) {
    responsesSheet = spreadsheet.insertSheet(RESPONSES_SHEET_NAME);
  }
  responsesSheet.clear();
  responsesSheet.getRange(1, 1, 1, 3).setValues([['Name', 'Selected Answer', 'Timestamp']]);
}