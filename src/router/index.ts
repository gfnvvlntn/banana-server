import {Request, Response, Router} from 'express';
import UserController from '../controllers/user-controller'
import {check} from "express-validator"

const router = Router();

router.get('/', (request: Request, response: Response) => {
    response.send('Banana');
})

router.post(
    "/registration",
    check("email", "Введен не корректный email").isEmail(),
    check("password")
        .not()
        .isIn(["123456", "qwerty", "password", "пароль"])
        .withMessage("Введен слишком простой пароль")
        .isLength({min: 6})
        .withMessage("Пароль должен состоять минимум из 6 символов"),
    UserController.registration
);

router.post("/login", UserController.login);
router.post("/logout", UserController.logout);

export default router
