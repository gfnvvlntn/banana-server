import {model, Schema} from 'mongoose'
import {IUser} from "../interfaces/user";


const UserSchema = new Schema<IUser>({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    feedback: {type: String, default: ''}
});

export default model("User", UserSchema);
