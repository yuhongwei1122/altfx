import React from 'react';
import { Route, Redirect} from 'react-router-dom'
import auth from '../auth/auth.js';
// import get from 'lodash/get';


function PrivateRoute({component: Component, path: path, ...rest}) {
    return (
        <Route path={path} {...rest} render={props => {

            if (auth && auth.checkLogin()) {

                // 登陆成功后，检查用户页面访问权限
                if(process.env.NODE_ENV !== 'development' && !auth.checkMenuPermissions(path)){
                    return (
                        <Redirect to={{
                            pathname: '/403',
                                state: { from: props.location }
                        }}/>
                    )
                }

                return (
                    <Component {...props}/>
                );
            }

            return (
                <Redirect to={{
                    pathname: '/login',
                    state: { from: props.location }
                }}/>
            )
        }}/>
    )
}

export default  PrivateRoute;
