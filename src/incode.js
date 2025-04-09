import { create } from "@incodetech/welcome";
import translations from "./translations";
const apiURL = process.env.REACT_APP_INCODE_API_URL;

const incode = create({
  apiURL: apiURL,
  lang: 'en-US',
  translations
});

export { incode };