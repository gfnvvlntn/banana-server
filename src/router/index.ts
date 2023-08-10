import {Request, Response, Router} from 'express';

const router = new Router();

router.get('/', (request: Request, response: Response) => {
    response.send('Banana');
})

export default router
