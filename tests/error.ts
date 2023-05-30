import ApplicationError from '../src/errors/ApplicationError';

const message = 'error message';

const runTests = () => {
  const results: Record<string, string>[] = [];

  let error = new ApplicationError();
  expect(error.message).toBe('ApplicationError');
  results.push({
    name: 'sets default error message',
    status: error.status === 500 ? 'passed' : 'failed'
  });

  error = new ApplicationError(message);
  expect(error.message).toBe(message);
  results.push({
    name: 'sets correct message',
    status: error.status === 500 ? 'passed' : 'failed'
  });

  error = new ApplicationError(message);
  expect(error.status).toBe(500);
  results.push({
    name: 'sets 500 as default status code',
    status: error.status === 500 ? 'passed' : 'failed'
  });

  const status = 400;
  error = new ApplicationError(message, status);
  expect(error.status).toBe(status);
  results.push({
    name: 'sets correct status',
    status: error.status === status ? 'passed' : 'failed'
  });

  return results;
};

export default runTests;
