export interface IUser {
    id: string;
    email: string
    password?: string
    feedback: string

    save?(): Promise<Promise<any>>;
}
