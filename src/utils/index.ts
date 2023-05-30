import { Request } from 'express';
import { BASE_URL } from '../config';

export const getUrl = (
  route: string,
  parameter?: string
) => {
  let uri = `${BASE_URL}${route}`;
  if (parameter) {
    uri = `${uri}/${parameter}`;
  }
  return uri;
};

export const getDurationInMilliseconds = (
  start: [number, number]
) => {
  const nanoPerMillis = 1e9;
  const nanoTMillis = 1e6;
  const diff = process.hrtime(start);
  return (diff[0] * nanoPerMillis + diff[1]) / nanoTMillis;
};

export const getRemoteHost = (
  req: Request
): string => (req.headers['x-forwarded-for'] || req.socket?.remoteAddress) as string;
