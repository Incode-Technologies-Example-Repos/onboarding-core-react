/* 
  IMPORTANT:
  DO NOT FETCH YOUR SESSION TOKEN AT FRONTEND

  ALWAYS REQUEST A NEW SESSION TOKEN FROM YOUR APPLICATION BACKEND.

  MORE INFO:
  https://developer.incode.com/docs/tutorial-creating-an-identity-validation-app
*/

export const getIncodeToken = async () => {
  try {
    let headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append("api-version", "1.0");
    headers.append("x-api-key", process.env.REACT_APP_INCODE_API_KEY);

    let body = JSON.stringify({
      countryCode: "ALL",
      configurationId: process.env.REACT_APP_INCODE_CONFIG_ID,
    });

    let requestOptions = {
      method: "POST",
      headers,
      body,
      redirect: "follow",
    };

    const response = await fetch(
      `${process.env.REACT_APP_INCODE_API_URL}/omni/start`,
      requestOptions
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();

    return { token: result.token };
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};
