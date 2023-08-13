import {Types} from 'mongoose';

export default interface IToken {
    user: Types.ObjectId
    refreshToken: string
    async

    save(): Promise<Promise<any>>;
}
