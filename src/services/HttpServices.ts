import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const baseApiClient = axios.create({
  baseURL: apiUrl,
  // https://github.com/axios/axios#-automatic-serialization-to-formdata
  formSerializer: { indexes: null },
  paramsSerializer: { indexes: null },
});
