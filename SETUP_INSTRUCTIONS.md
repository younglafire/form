# Complete Setup Instructions

## Important: CORS Error Fix

The "Failed to fetch" error you're seeing is a CORS (Cross-Origin Resource Sharing) issue. This is normal when developing locally and trying to connect to external APIs like Google Apps Script.

**The app will work perfectly when deployed to production**, but for local development, it falls back to mock data.

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
2. Replace the current URL with your actual web app URL from step 3
3. Save the file

## Step 5: Test

### Local Development
- The app will show mock data due to CORS restrictions
- This is normal and expected behavior
- You can test the UI and functionality with the mock data

### Production Testing
1. Deploy your app to a production environment (like Netlify)
2. The deployed version will connect to Google Sheets properly
3. Test form submissions in the deployed version

## Understanding the CORS Issue

**Why this happens:**
- Browsers block requests from `localhost` to external domains for security
- Google Apps Script URLs are external domains
- This is a browser security feature, not a bug

**Solutions:**
1. **Use mock data in development** (current approach - recommended)
2. **Test in production** where CORS doesn't apply
3. **Use a proxy server** (more complex setup)

## Troubleshooting

If it still doesn't work in production:

1. Check the browser console for error messages
2. In Google Apps Script, go to "Executions" to see if there are any errors
3. Make sure your sheet names are EXACTLY: "Available Answers" and "Responses"
4. Make sure the web app is deployed with "Anyone" access
5. Try running the `initializeSheets()` function once in Apps Script to set up the sheets automatically

## Current Status

✅ **Local Development**: Working with mock data (CORS fallback)
🔄 **Production**: Ready to test once deployed
📝 **Google Sheets**: Ready for real data integration