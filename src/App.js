/* 
INCODE WEB SDK AND REACT INTEGRATION 

MORE INFO:
https://developer.incode.com/docs/tutorial-creating-an-identity-validation-app
*/

import React, { useEffect, useState, useRef } from "react";
import { incode } from "./incode";
import "./App.css";

let incodeSession;
let container;

//Function to fetch the onboarding session from your backend
async function startOnboardingSession() {
  const tokenServerURL = process.env.REACT_APP_TOKEN_SERVER_URL;
  const sessionStartUrl = `${tokenServerURL}/start`
  
  
  const response = await fetch(sessionStartUrl);
  if (!response.ok) {
    const sessionData = await response.json();
    throw new Error(sessionData.error);
  }
  
  return await response.json();
}

function captureIdFrontSide() {
  incode.renderCamera("front", container, {
    onSuccess: captureIdBackSide,
    onError: console.log,
    token: incodeSession,
    numberOfTries: 3,
    showTutorial: true,
  });
}

function captureIdBackSide() {
  incode.renderCamera("back", container, {
    onSuccess: processId,
    onError: console.log,
    token: incodeSession,
    numberOfTries: 3,
    showTutorial: true,
  });
}

function processId() {
  return incode
  .processId({ token: incodeSession.token })
  .then(() => {
    captureSelfie();
  })
  .catch((error) => {
    console.log(error);
  });
}

function captureSelfie() {
  incode.renderCamera("selfie", container, {
    onSuccess: finishOnboarding,
    onError: console.log,
    token: incodeSession,
    numberOfTries: 3,
    showTutorial: true,
  });
}

function finishOnboarding() {
  incode.getFinishStatus(null, { token: incodeSession.token }).then(() => {
    console.log("Onboarding Finished");
    container.innerHTML="Onboarding Finished";
  });
}

function saveDeviceData() {
  incode.sendGeolocation({ token: incodeSession.token });
  incode.sendFingerprint({ token: incodeSession.token });
}

function App() {
  const [session, setSession] = useState(null); // Stores the Session
  const incodeContainerRef = useRef(null);
  
  // Store data that will not trigger re-renders unless specifically told so
  const isLoaded = useRef(false); 
  
  // Run this after the initial loading
  useEffect(() => {
    // Only fetch the data if we havent fetched it yet
    if (isLoaded.current) return;
    
    //Fetch the session and save it on the session variable
    startOnboardingSession().then(async (session) => {
      setSession(session);
    }).catch(
      (e)=>console.log(e)
    );
    
    // We already sent the async call, don't call it again
    isLoaded.current = true;
  }, []);
  
  useEffect(()=>{
    container = incodeContainerRef.current;
    if(session){
      incodeSession=session;
      saveDeviceData();
      captureIdFrontSide();
    };
  }, [session])
 
  return (
    <div className="App">
    <div ref={incodeContainerRef}></div>
    {!session && (
      <p>Starting session...</p>
    )}
    <div ref={incodeContainerRef}></div>
    </div>
  );
}

export default App;
