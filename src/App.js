/* 
  INCODE WEB SDK AND REACT INTEGRATION 

  MORE INFO:
  https://developer.incode.com/docs/tutorial-creating-an-identity-validation-app
*/

import React, { useEffect, useState, useRef } from "react";
import { getIncodeToken } from "./incode-session-service";
import translations from "./translations";
import "./App.css";
let incode;
let incodeSession;
let SDKActive = false;
let container;

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
  });
}

function saveDeviceData() {
  incode.sendGeolocation({ token: incodeSession.token });
  incode.sendFingerprint({ token: incodeSession.token });
}

function App() {
  const incodeContainerRef = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (!SDKActive) {
      SDKActive = true;

      const script = document.createElement("script");
      script.src = process.env.REACT_APP_INCODE_WEB_SDK_URL;
      script.async = true;

      script.onload = async () => {
        console.log("Incode Web SDK Loaded");
        setScriptLoaded(true);
        incode = window.OnBoarding.create({
          apiURL: process.env.REACT_APP_INCODE_API_URL,
          translations
        });
        incodeSession = await getIncodeToken();

        container = incodeContainerRef.current;

        saveDeviceData();
        captureIdFrontSide();
      };
      script.onerror = () => {
        console.error("Error loading the Incode Web SDK");
        setScriptLoaded(false);
      };

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  return (
    <div className="App">
      {scriptLoaded ? (
        <div ref={incodeContainerRef}></div>
      ) : (
        <p>Loading the Incode Web SDK...</p>
      )}
    </div>
  );
}

export default App;
