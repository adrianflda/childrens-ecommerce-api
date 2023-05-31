import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongoose';
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

export const paginate = (
  limit: number,
  minLimit: number,
  maxLimit: number = 50
) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.query.page && !Number.isNaN(parseInt(req.query.page as string, 10))) {
    let page = parseInt(req.query.page as string, 10);
    if (page < 1) {
      page = 1;
    }
    req.query.page = page as any;
  }

  if (req.query.limit && !Number.isNaN(parseInt(req.query.limit as string))) {
    let reqLimit = parseInt(req.query.limit as string);
    if (reqLimit < minLimit) {
      reqLimit = limit;
    } else if (reqLimit > maxLimit) {
      reqLimit = maxLimit;
    }
    req.query.limit = reqLimit as any;
  } else {
    req.query.limit = limit as any;
  }

  next();
};
