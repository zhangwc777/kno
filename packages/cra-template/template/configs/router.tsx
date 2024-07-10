import React from 'react';
import type { RouteObject } from 'react-router-dom';

import Home from '@/pages/home';
const routes: Array<RouteObject> = [
    {
        path: '/',
        element: <Home />,
    },
];
export default routes;
