/* 
INCODE WEB SDK AND REACT INTEGRATION 

MORE INFO:
https://developer.incode.com/docs/tutorial-creating-an-identity-validation-app
*/

import React, { useEffect, useState, useRef } from "react";
import { incode } from "./incode";
import { fakeBackendStart, fakeBackendFinish } from "./fake_backend";
import "./App.css";

let incodeSession;
let container;

function captureId() {
  console.log({incodeSession});
  incode.renderCaptureId(container, {
    onSuccess: processId,
    onError: console.log,
    session: incodeSession,
    forceIdV2: true
  });
}

function processId() {
  return incode
    .processId(incodeSession)
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
  fakeBackendFinish(incodeSession.token).then((response) => {
    console.log(response);
    container.innerHTML = "Onboarding Finished";
  });
}

function App() {
  const [session, setSession] = useState(null); // Stores the Session
  const incodeContainerRef = useRef(null);

  // Store data that will not trigger re-renders unless specifically told so
  const isLoaded = useRef(false);

  // Run this after the initial loading
  useEffect(() => {
    console.log("Starting session");
    // Only fetch the data if we havent fetched it yet
    if (isLoaded.current) return;

    async function initializeIncode() {
      console.log("initializing Incode");
      fakeBackendStart().then(async (session) => {
        console.log("we have session", session);
        setSession(session);
        //await incode.initialize();
        
        isLoaded.current = true;
      });
    }

    initializeIncode();
  }, []);

  useEffect(() => {
    console.log("Session changed");
    container = incodeContainerRef.current;
    if (session) {
      incodeSession = session;
      console.log("call captureId");
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
