import {
  Request, Response, NextFunction, RequestHandler
} from 'express';

export const getAppInfo: RequestHandler = async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const externalizedAppInfo: any = {
    name: 'Children`s e-commerce API',
    homepage: '/',
    version: 'v1'
  };
  res.send(externalizedAppInfo);
};
