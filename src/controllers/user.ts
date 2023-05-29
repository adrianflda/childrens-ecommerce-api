import {
  Request,
  Response,
  NextFunction,
  RequestHandler
} from 'express';

export const userRoleUpdateController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('req', req);
    const { user: requestingUser } = req;
    console.log('requestingUser', requestingUser);
    const { newRoles } = req.body;
    console.log('newRoles', newRoles);
    const { userId } = req.params;
    console.log('userId', userId);
    return res.json({
      message: 'Successful user role updated'
    });
  } catch (error) {
    return next(error);
  }
};
