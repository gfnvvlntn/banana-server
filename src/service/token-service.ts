import jwt from 'jsonwebtoken'
import TokenModel from '../models/token-model'
import IToken from "../interfaces/token";

const config = require('config');

class TokenService {
    generateTokens(payload): { accessToken: string, refreshToken: string } {
        const accessToken = jwt.sign(payload, config.get('jwtAccessToken'), {expiresIn: '15m'})
        const refreshToken = jwt.sign(payload, config.get('jwtRefreshToken'), {expiresIn: '30d'})

        return {
            accessToken,
            refreshToken
        }
    }

    validateRefreshToken(token: string) {
        try {
            return jwt.verify(token, config.get('jwtRefreshToken'))
        } catch (e) {
            return null
        }
    }

    async saveTokens(userId: string, refreshToken: string) {
        const tokenData: IToken = await TokenModel.findOne({user: userId})

        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }

        return await TokenModel.create({user: userId, refreshToken})
    }

    removeToken(refreshToken: string) {
        return TokenModel.deleteOne({refreshToken});
    }

    findToken(refreshToken: string) {
        return TokenModel.findOne({refreshToken});
    }
}

export default new TokenService()
