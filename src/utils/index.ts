import { BASE_URL } from '../config';

export const getUrl = (route: string, parameter?: string) => {
  let uri = `${BASE_URL}${route}`;
  if (parameter) {
    uri = `${uri}/:${parameter}`;
  }
  return uri;
};
