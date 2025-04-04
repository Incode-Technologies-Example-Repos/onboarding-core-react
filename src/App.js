/* 
INCODE WEB SDK AND REACT INTEGRATION 

MORE INFO:
https://developer.incode.com/docs/tutorial-creating-an-identity-validation-app
*/

import React, { useEffect, useState, useRef } from "react";
import { renderCaptureId } from "@incodetech/welcome";
import { incode } from "./incode";
import "./App.css";

let incodeSession;
let container;

function captureId() {
  renderCaptureId(container, {
    onSuccess: processId,
    onError: console.log,
    session: incodeSession,
    //forceIdV2: true 
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
  container.innerHTML = "Onboarding Finished";
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

    incode
    .createSession("ALL", null, {
      configurationId: process.env.REACT_APP_BACKEND_FLOWID,
    })
    .then((session) => {
      setSession(session);
    });

    // We already sent the async call, don't call it again
    isLoaded.current = true;
  }, []);

  useEffect(() => {
    container = incodeContainerRef.current;
    if (session) {
      incodeSession = session;
      captureId();
    }
  }, [session]);

  return (
    <div className="App">
      <div ref={incodeContainerRef}></div>
      {!session && <p>Starting session...</p>}
    </div>
  );
}

export default App;
