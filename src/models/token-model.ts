import {model, Schema} from 'mongoose'
import IToken from "../interfaces/token";

const TokenSchema = new Schema<IToken>({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    refreshToken: {type: String, required: true}
})

export default model('Token', TokenSchema)
