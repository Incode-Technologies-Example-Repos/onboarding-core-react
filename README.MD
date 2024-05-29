
# Incode Web SDK integration example (React)

## Install
To install execute the following command in the terminal:
```bash
npm install
```
## Setup
Create your `.env` file based on the `.env.example` file`.

```env
# Incode API URL for demo or saas environment 
REACT_APP_INCODE_API_URL="https://demo-api.incodesmile.com/0"

# URL of your backend server that does `/start`
REACT_APP_TOKEN_SERVER_URL="https://your-backend-server.com"
```

## Run the project
To run the project execute the following command in the terminal:
```bash
npm install
```

Test the application in your mobile phone: https://your-local-ip:5173/

## Backend Server
A backend server that will start the session is needed for this sample,
luckily for you we already have a sample server for NodeJS, please reffer
to our documentation on subject: [Sample Backend Server](https://developer.incode.com/docs/code-samples-for-web-integrations#backend-sample-server)

You will need to expose this server to the internet using something like
[ngrok](https://ngrok.com/docs/getting-started/)

## About the Incode Web SDK

Please read our official documentation [about Incode WebSDK](https://developer.incode.com/docs/about-incode-websdk)

## Author

© Incode Technologies Inc. All rights reserved.
