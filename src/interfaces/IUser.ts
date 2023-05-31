export interface IProfile {
    age?: number,
    gender?: string,
    email?: string,
    phone?: string,
    address?: string
}

export interface ISimpleUser {
    id?: any,
    username: string,
    displayName?: string
    profile?: IProfile,
}

interface IUser extends ISimpleUser{
    deleted?: boolean,
    token?: string | null,
    roles?: string[]
}
export default IUser;
