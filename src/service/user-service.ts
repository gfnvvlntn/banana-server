import UserModel from "../models/user-model"
import bcrypt from "bcrypt"
import tokenService from "./token-service"
import {IUser} from "../interfaces/user";
import UserDto from '../dtos/user-dto'

class UserService {
    async registration(email: string, password: string): Promise<{ accessToken: string, refreshToken: string, user: IUser, error: number, message: string }> {
        const candidate = await UserModel.findOne({email});
        if (candidate) {
            return {
                accessToken: '',
                refreshToken: '',
                user: {} as IUser,
                error: 1,
                message: `Такой пользователь уже существует`
            };
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const user: IUser = await UserModel.create({
            email,
            password: hashPassword,
            feedback: ''
        });

        const userDto = new UserDto(user);

        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveTokens(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto, error: 0, message: ''};
    }

    async login(email: string, password: string): Promise<{ accessToken: string, refreshToken: string, user: IUser, error: number, message: string }> {
        const user: IUser = await UserModel.findOne({email});
        if (!user) {
            return {
                accessToken: '',
                refreshToken: '',
                user: {} as IUser,
                error: 1,
                message: `Не верный email или пароль`
            };
        }
        const isPasswordEquals = await bcrypt.compare(password, user.password);
        if (!isPasswordEquals) {
            return {
                accessToken: '',
                refreshToken: '',
                user: {} as IUser,
                error: 1,
                message: `Не верный email или пароль`
            };

        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveTokens(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto, error: 0, message: ''};
    }

    async logout(refreshToken) {
        return tokenService.removeToken(refreshToken);
    }

    async sendFeedback(email: string, feedback: string) {
        if (!feedback) {
            return {
                accessToken: '',
                refreshToken: '',
                user: {} as IUser,
                error: 1,
                message: `Заполните поля для отзыва`
            };
        }

        await UserModel.findOneAndUpdate({email}, {$set: {feedback}});

        const user: IUser = await UserModel.findOne({email})

        const userDto = new UserDto(user);

        return {user: userDto}
    }


    async refresh(refreshToken: string) {
        if (!refreshToken) {
            console.log('error')
        }
        const tokenData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDB = tokenService.findToken(refreshToken);
        if (!tokenData || !tokenFromDB) {
            console.log('error')
        }
        const user: IUser = await UserModel.findById(tokenData);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveTokens(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto};
    }
}

export default new UserService();
