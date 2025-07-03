# Complete Setup Instructions

## Step 1: Update Your Google Apps Script

1. Go to your Google Apps Script: https://script.google.com/home/projects/1KBkV1AnDoWMuuGioL_QIFfm4w2Bk-OvkRj0qRUFD7KbBEGg0wBjWzjBG/edit

2. Replace ALL the code in your Apps Script with the updated code from `public/google-apps-script.js`

3. The spreadsheet ID is already set correctly in the new code: `1yiDxCaNusnf7d7GfDKp_zG9GyR35OEzpCxbi1xt5sF4`

## Step 2: Set Up Your Google Sheets

1. Go to your spreadsheet: https://docs.google.com/spreadsheets/d/1yiDxCaNusnf7d7GfDKp_zG9GyR35OEzpCxbi1xt5sF4/edit

2. Create two sheets (tabs) with these EXACT names:
   - `Available Answers`
   - `Responses`

3. In the "Available Answers" sheet, add these columns in row 1:
   - Column A: `ID`
   - Column B: `Text`

4. Add some sample data in rows 2-6:
   ```
   Row 2: 1 | First Available Option
   Row 3: 2 | Second Available Option  
   Row 4: 3 | Third Available Option
   Row 5: 4 | Fourth Available Option
   Row 6: 5 | Fifth Available Option
   ```

5. In the "Responses" sheet, add these columns in row 1:
   - Column A: `Name`
   - Column B: `Selected Answer`
   - Column C: `Timestamp`

## Step 3: Deploy Your Apps Script

1. In your Apps Script editor, click "Deploy" → "New deployment"
2. Choose type: "Web app"
3. Description: "Form Handler"
4. Execute as: "Me"
5. Who has access: "Anyone"
6. Click "Deploy"
7. **COPY THE WEB APP URL** - you'll need this for the next step

## Step 4: Update the React App

1. Open `src/services/googleSheets.ts`
2. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with your actual web app URL from step 3
3. Save the file

## Step 5: Test

1. Run your React app
2. Try submitting a form response
3. Check your Google Sheets to see if the data appears

## Troubleshooting

If it still doesn't work:

1. Check the browser console for error messages
2. In Google Apps Script, go to "Executions" to see if there are any errors
3. Make sure your sheet names are EXACTLY: "Available Answers" and "Responses"
4. Make sure the web app is deployed with "Anyone" access
5. Try running the `initializeSheets()` function once in Apps Script to set up the sheets automatically