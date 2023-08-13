import userService from "../service/user-service"
import {Result, validationResult} from "express-validator"
import {NextFunction, Request, Response} from 'express';
import {IUser} from "../interfaces/user";

class UserController {
    async registration(req, res, next) {
        try {
            const result: Result = validationResult(req);

            if (!result.isEmpty()) {
                const errors = result.array();
                return res.json({
                    error: 1,
                    message: errors[0].msg || `auth error.validation error`,
                });
            }

            const {email, password} = req.body;

            const userData: { accessToken: string, refreshToken: string, user: IUser, error: number, message: string } = await userService.registration(email, password);

            if (userData?.error) {
                return res.json(userData);
            }


            res.cookie("refreshToken", userData?.refreshToken, {
                maxAge: 2592000000,
                httpOnly: true,
            });

            return res.json({...userData});
        } catch (e) {
            next(e);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const {email, password} = req.body;

            const userData = await userService.login(email, password);

            res.cookie("refreshToken", userData.refreshToken, {
                maxAge: 2592000000,
                httpOnly: true,
            });

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const {refreshToken} = req.cookies;

            const token = await userService.logout(refreshToken);

            res.clearCookie("refreshToken");

            return res.json(token);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const {refreshToken} = req.cookies;

            const userData = await userService.refresh(refreshToken);

            res.cookie("refreshToken", userData.refreshToken, {
                maxAge: 2592000000,
                httpOnly: true,
            });

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }
}

export default new UserController();
