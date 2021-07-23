import Vue from 'vue';
import Router from 'vue-router';
import { log, auth } from './middlewares'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'boards',
            component: () => import("./components/boards/Boards"),
            children: [
                {
                    path: 'task/:id',
                    name: 'task-page',
                    component: () => import("./components/task/Task")
                }
            ],
            meta: {
                middleware: auth,
            }
        },
        {
            path: '/signing',
            name: 'signing',
            component: () => import("./components/auth/Signing"),
            meta: {
                middleware: log,
            }
        },
        {
            path: '/signup',
            name: 'signup',
            component: () => import("./components/auth/SignUp"),
            meta: {
                middleware: log,
            }
        },
    ]
})