# invoice-reminder-app

A brief description of my project and its purpose.

## Backend Setup (Node.js)

1. **Set up a Node.js application with Google OAuth for authentication**
   - I have Set up a Node.js project with necessary dependencies.
   - Implemented Google OAuth authentication using library `google-auth-library`.
   - Secured the authentication flow and handle user login via Google.

2. **Create APIs for viewing invoices and triggering Zapier automation**
   - Created RESTful APIs to retrieve and display invoices.
   - I have Implemented  additional APIs to trigger events that will interact with Zapier.

3. **Integrate with Zapier to automate tasks**
   -I have Set up API endpoints that can be used to trigger tasks on Zapier.
   - Worked with  Zapier API to automate actions like sending reminders and follow-ups.
  

## Frontend Setup (React)

1. **Implement Google OAuth login**
   - I have Set up Google OAuth login functionality on the frontend using a library like `react-oauth/google`.
   - Integrated the Google login button and handle user authentication.

2. **Display invoice details**
   - Created React components to display invoice details in a user-friendly format.
   - Fetch invoice data from the backend using  `axios`.

3. **Trigger automation through Zapier**
   - I Added UI elements (buttons or triggers) to trigger automation via Zapier.
   - I have Used the backend API to trigger actions in Zapier (e.g., sending reminders or follow-ups).
   
## Zapier Integration

1. **Create a Zap in Zapier**
   - Set up a new Zap in the Zapier dashboard.
   - Use  API endpoints as triggers or actions in the Zap.

2. **Send reminders and follow-up emails when invoices are overdue**
   - Created workflows in Zapier that send automated reminders and follow-up emails when invoices are overdue.
     
  ## Installation
  
  
# For running Backend

- cd backend

- npm init -y

- npm install express cors dotenv passport-google-oauth20 passport jsonwebtoken axios

- Set up environment variables for Google OAuth
      # Create a .env file and add the required credentials
         GOOGLE_CLIENT_ID=your-google-client-id
         GOOGLE_CLIENT_SECRET=your-google-client-secret
  
- npm start

# For running Frontend

- cd Frontend

- npm install axios react-router-dom jwt-decode

- npm install @mui/material @emotion/react @emotion/styled

##Usage

Visit the frontend URL ( http://localhost:3001).

Login using your Google account.

View your invoice details fetched from the backend.

Trigger automated actions (such as reminders or follow-ups) via Zapier directly from the frontend.
