import { Application } from 'express';
import { Server } from 'http';
import IUser from './IUser';

interface IContext {
    app?: Application,
    server?: Server,
    mongo: any,
    env?: string,
    users?: Record<string, IUser>
}
export default IContext;
