# Google Sheets Connected Form

A beautiful, production-ready web form that connects to Google Sheets for dynamic answer management and response collection.

## Features

- **Real-time Integration**: Connects to Google Sheets for live data management
- **Dynamic Options**: Available answers are fetched from Google Sheets
- **Duplicate Prevention**: Each answer can only be selected once
- **Real-time Updates**: Form updates automatically when others submit responses
- **Beautiful Design**: Clean, minimal interface with smooth animations
- **Responsive**: Works perfectly on all devices
- **Error Handling**: Comprehensive error handling and user feedback
- **Loading States**: Professional loading indicators throughout

## Setup Instructions

### 1. Create Google Sheets
   
1. Create a new Google Spreadsheet
2. Create two sheets within the spreadsheet:
   - **Available Answers** with columns: `ID`, `Text`
   - **Responses** with columns: `Name`, `Selected Answer`, `Timestamp`

### 2. Set Up Google Apps Script

1. Go to [script.google.com](https://script.google.com)
2. Create a new project
3. Replace the default code with the contents of `public/google-apps-script.js`
4. Update the `SPREADSHEET_ID` constant with your Google Sheets ID
5. Save the project

### 3. Deploy the Apps Script

1. Click "Deploy" → "New deployment"
2. Choose type: "Web app"
3. Execute as: "Me"
4. Who has access: "Anyone"
5. Click "Deploy"
6. Copy the web app URL

### 4. Configure the React App

1. Open `src/services/googleSheets.ts`
2. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with your web app URL
3. Save the file

### 5. Initialize Sample Data (Optional)

1. In Google Apps Script, run the `initializeSheets()` function once to create sample data
2. Or manually add data to your "Available Answers" sheet

## Usage

1. Users enter their name
2. Select from available radio button options
3. Submit the form
4. Selected answer is saved to "Responses" sheet
5. Selected answer is removed from "Available Answers" sheet
6. Other users see updated options in real-time

## Architecture

- **Frontend**: React with TypeScript and Tailwind CSS
- **Backend**: Google Apps Script
- **Database**: Google Sheets
- **Real-time Updates**: Polling every 30 seconds
- **Error Handling**: Comprehensive error states and retry mechanisms

## File Structure

```
src/
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── services/           # External service integrations
└── types/              # TypeScript type definitions
```

## Customization

The form is built with modularity in mind. You can easily:

- Modify the polling interval in `useGoogleSheets.ts`
- Customize the UI components in the `components/` directory
- Add additional form fields by extending the types and components
- Implement different authentication methods
- Add more sophisticated real-time updates (WebSockets, etc.)

## Development

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run lint   # Run linting
```