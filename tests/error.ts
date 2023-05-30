import ApplicationError from '../src/errors/ApplicationError';

const message = 'error message';

describe('ApplicationError test suite', () => {
  test('sets default error message', () => {
    const error = new ApplicationError();
    expect(error.message).toBe('ApplicationError');
  });

  test('sets correct message', () => {
    const error = new ApplicationError(message);
    expect(error.message).toBe(message);
  });

  test('sets 500 as default status code', () => {
    const error = new ApplicationError(message);
    expect(error.status).toBe(500);
  });

  test('sets correct status', () => {
    const status = 400;
    const error = new ApplicationError(message, status);
    expect(error.status).toBe(status);
  });
});
