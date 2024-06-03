import cors from 'cors';
import express, { Request, Response } from 'express';
import httpProxy from 'http-proxy';

const app = express();

app.use(cors());

const proxy = httpProxy.createProxyServer();

const services = [
    {
        name: 'offers',
        baseURL: 'http://localhost:3001',
        routes: [
            { path: '/offers/getById', method: 'post', targetPath: '/getById' },
            { path: '/offers/getAll', method: 'get', targetPath: '/getAll' },
            { path: '/offers/create', method: 'post', targetPath: '/create' },
            { path: '/offers/update', method: 'post', targetPath: '/update' },
            { path: '/offers/delete', method: 'post', targetPath: '/delete' },
            { path: '/offers/images/*', method: 'get', targetPath: '/images' }
        ]
    },
    {
        name: 'users',
        baseURL: 'http://localhost:3002',
        routes: [
            { path: '/users/getById', method: 'post', targetPath: '/getById' },
            { path: '/users/getAll', method: 'get', targetPath: '/getAll' },
            { path: '/users/register', method: 'post', targetPath: '/register' },
            { path: '/users/update', method: 'post', targetPath: '/update' },
            { path: '/users/delete', method: 'post', targetPath: '/delete' },
            { path: '/users/images/*', method: 'get', targetPath: '/images' }
        ]
    },
    {
        name: 'reviews',
        baseURL: 'http://localhost:3003',
        routes: [
            { path: '/reviews/getById', method: 'post', targetPath: '/getById' },
            { path: '/reviews/getByOffer', method: 'post', targetPath: '/getByOffer' },
            { path: '/reviews/getAll', method: 'get', targetPath: '/getAll' },
            { path: '/reviews/create', method: 'post', targetPath: '/create' },
            { path: '/reviews/comment', method: 'post', targetPath: '/comment' },
            { path: '/reviews/delete', method: 'post', targetPath: '/delete' },
            { path: '/reviews/media/*', method: 'get', targetPath: '/media' }
        ]
    }
];

services.forEach(service => {
    service.routes.forEach(route => {
        switch (route.method) {
            case 'get':
                app.get(route.path, (req: Request, res: Response) => {
                    const targetUrl = new URL(`${service.baseURL}${route.targetPath}`);

                    route.path.includes("*")
                        ? req.url = req.originalUrl.replace(`/${service.name}`, '')
                        : req.url = `${service.baseURL}${route.targetPath}`;

                    proxy.web(req, res, { target: targetUrl.origin });
                });
                break;

            case 'post':
                app.post(route.path, (req: Request, res: Response) => {
                    const targetUrl = new URL(`${service.baseURL}${route.targetPath}`);
                    req.url = `${service.baseURL}${route.targetPath}`;
                    proxy.web(req, res, { target: targetUrl.origin });
                });
                break;

            default:
                break;
        }
    });
});

app.listen(3000, () => {
    console.log('API Gateway running on port 3000');
});
