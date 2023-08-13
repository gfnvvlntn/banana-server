import jwt from 'jsonwebtoken'
import TokenModel from '../models/token-model'
import IToken from "../interfaces/token";

class TokenService {
    generateTokens(payload): { accessToken: string, refreshToken: string } {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, {expiresIn: '15m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, {expiresIn: '30d'})

        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_TOKEN)

        } catch (e) {
            return null
        }
    }

    validateRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_TOKEN)
        } catch (e) {
            return null
        }
    }

    async saveTokens(userId, refreshToken) {
        const tokenData: IToken = await TokenModel.findOne({user: userId})

        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }

        return await TokenModel.create({user: userId, refreshToken})
    }

    removeToken(refreshToken) {
        return TokenModel.deleteOne({refreshToken});
    }

    findToken(refreshToken) {
        return TokenModel.findOne({refreshToken});
    }
}

export default new TokenService()
