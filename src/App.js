/* 
INCODE WEB SDK AND REACT INTEGRATION 

MORE INFO:
https://developer.incode.com/docs/tutorial-creating-an-identity-validation-app
*/

import { useEffect, useState, useRef } from "react";
import { incode } from "./incode";
import { fakeBackendStart, fakeBackendFinish } from "./fake_backend";
import "./App.css";

const consentId = process.env.REACT_APP_CONSENT_ID; // ID of the consent created in the dashboard
let incodeSession;
let container;

// 1.- Check if mandatory consent is required. and show it if it is.
function checkMandatoryConsent() {
  incode.sendFingerprint({ token: incodeSession.token }).then((response) => {
    // Send fingerprint returns a response with the following structure:
    //   {
    //     "success": true,
    //     "sessionStatus": "Alive",
    //     "ipCountry": "UNITED STATES",
    //     "ipState": "ILLINOIS",
    //     "showMandatoryConsent": true,
    //     "regulationType": "US_Illinois"
    // }
    // If the response has showMandatoryConsent and is set to true, we need to show the mandatory consent
    if (response?.showMandatoryConsent) {
      incode.renderMandatoryConsent(container, {
        token: incodeSession,
        onSuccess: captureCombinedConsent,
        onCancel: () => console.log("Mandatory consent was denied"),
        regulationType: response.regulationType,
      });
    } else {
      captureCombinedConsent();
    }
  });
}

// 2.- Show the combined consent
//    This consent is created in the dashboard and has to be passed as a parameter
//    to the renderCombinedConsent function.
function captureCombinedConsent() {
  incode.renderCombinedConsent(container, {
    token: incodeSession,
    onSuccess: sendGeolocation,
    consentId: consentId, // id of a consent created in dashboard
  });
}

// 3.- Send geolocation and start the ID capture flow
function sendGeolocation() {
  incode.sendGeolocation({ token: incodeSession.token });
  captureId();
}
function captureId() {
  incode.renderIdCapture(container, {
    onSuccess: processId,
    onError: console.log,
    session: incodeSession,
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
  fakeBackendFinish(incodeSession.token).then(() => {
    console.log("Onboarding Finished");
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
    // Only fetch the data if we havent fetched it yet
    if (isLoaded.current) return;

    //Fetch the session and save it on the session variable
    fakeBackendStart()
      .then(async (session) => {
        setSession(session);
      })
      .catch((e) => console.log(e));

    // We already sent the async call, don't call it again
    isLoaded.current = true;
  }, []);

  useEffect(() => {
    container = incodeContainerRef.current;
    if (session) {
      incodeSession = session;
      checkMandatoryConsent();
    }
  }, [session]);

  return (
    <div className="App">
      <div ref={incodeContainerRef}></div>
      {!session && <p>Starting session...</p>}
      <div ref={incodeContainerRef}></div>
    </div>
  );
}

export default App;
