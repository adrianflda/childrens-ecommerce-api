interface IUser {
    id?: any,
    profile?: any,
    username: string,
    displayName?: string,
    deleted?: boolean,
    token?: string | null,
    roles?: string[]
}

export default IUser;
