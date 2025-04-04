import { create } from "@incodetech/welcome";
import translations from "./translations";
const apiURL = process.env.REACT_APP_INCODE_API_URL;
const apiKey = process.env.REACT_APP_BACKEND_APIKEY;

const incode = create({
  apiURL: apiURL,
  apiKey: apiKey,
  lang: 'en-US',
  translations
});

export { incode };