import request from 'supertest';
import IContext from '../../src/interfaces/IContext';
import { getUrl } from '../../src/utils';

export const signup = async (
  context: IContext,
  username: string,
  password: string,
  confirmPassword: string
) => request(context.app)
  .post(getUrl('/auth/signup'))
  .send({ username, password, confirmPassword })
  .set('Accept', 'application/json');

export const login = async (
  context: IContext,
  username: string,
  password: string
) => request(context.app)
  .post(getUrl('/auth/login'))
  .send({ username, password })
  .set('Accept', 'application/json');
