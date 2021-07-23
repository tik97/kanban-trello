export function log ({ next }) {
    next()
    // if (to.name === 'signing' || to.name === 'signup') {
    //     return next({ name: 'boards' });
    // }
}

export function auth ({ next, to }) {
    if (!localStorage.getItem('userData') && (to.name === 'signing' || to.name === 'signup')) {
        return next()
    } else if(!localStorage.getItem('userData')){
        return next({ name: 'signing' })
    }

    return next()
}

export function nextFactory(context, middleware, index) {
    const subsequentMiddleware = middleware[index];
    if (!subsequentMiddleware) return context.next;
    return (...parameters) => {
        context.next(...parameters);
        const nextMiddleware = nextFactory(context, middleware, index + 1);
        subsequentMiddleware({...context, next: nextMiddleware});
    };
}