import React from 'react';
import { useRoutes } from 'react-router-dom';

import routes from '../configs/router';
// import Layout from ""
const Main = () => {
    const router = useRoutes(routes);
    return <main>{router}</main>;
};
export default Main;
