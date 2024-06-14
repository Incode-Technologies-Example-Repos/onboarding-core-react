
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
REACT_APP_INCODE_API_URL=https://demo-api.incodesmile.com/0

# HERE ONLY FOR DEMO PURPOSES, THE APIKEY AND THE FLOW_ID SHOULD NEVER BE IN THE FRONTEND.
REACT_APP_BACKEND_APIURL=https://demo-api.incodesmile.com
REACT_APP_BACKEND_APIKEY=
REACT_APP_BACKEND_FLOWID=
```

## Run the project
To run the project execute the following command in the terminal:
```bash
npm start
```

Test the application in your mobile phone: https://your-local-ip:5173/

# Fake Backend Server
Starting and Finishing the session must be done in the backend, to simplify development this
sample includes a fake_backend.js file that does this in the frontend, please be advised to
replace this with a proper backend for your production runs. the APIKEY should never be
exposed in the frontend.

## About the Incode Web SDK

Please read our official documentation [about Incode WebSDK](https://developer.incode.com/docs/about-incode-websdk)

## Author

© Incode Technologies Inc. All rights reserved.
