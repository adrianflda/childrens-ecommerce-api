import ApplicationError from './ApplicationError';

class NotFoundError extends ApplicationError {
  constructor(message?: string) {
    super(message || 'Not Found', 404);
  }
}

export default NotFoundError;
