import * as React from 'react';
import { Route, Switch} from 'react-router';
import Layout from './components/Layout';
//Users Pages
import Home from './components/pages/userPages/Home';
import Home2 from './components/pages/userPages/Home2';
import StoreVehicle from './components/pages/userPages/StoreVehicle';
import RetrieveVehicle from './components/pages/userPages/RetrieveVehicle';
import StoreConfirmation from './components/pages/userPages/StoreConfirmation';
//Admin Pages
import AdminLogin from './components/pages/adminPages/AdminLogin';
import AdminOptions from './components/pages/adminPages/AdminOptions';
import AdminRegisterDriver from './components/pages/adminPages/AdminRegisterDriver';
import AdminRegisterCar from './components/pages/adminPages/AdminRegisterCar';
import AdminViewCars from './components/pages/adminPages/AdminViewCars';
import AdminViewDrivers from './components/pages/adminPages/AdminViewDrivers';
import AdminEditCar from './components/pages/adminPages/AdminEditCar';
import AdminEditDriver from './components/pages/adminPages/AdminEditDriver';
//Public Pages 
import PageNotFound from './components/pages/PageNotFound';
//CSS
import './App.css';

export default () => (
    <Layout>
        <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/store-vehicle' component={StoreConfirmation} />
            <Route exact path='/store-vehicle' component={StoreVehicle} />
            <Route exact path='/retrieve-vehicle' component={RetrieveVehicle} />
            <Route exact path='/admin-login' component={AdminLogin} />
            <Route exact path='/admin-options' component={AdminOptions} />
            <Route exact path='/admin-register-driver' component={AdminRegisterDriver} />
            <Route exact path='/admin-register-car' component={AdminRegisterCar} />
            <Route exact path='/admin-view-cars' component={AdminViewCars} />
            <Route exact path='/admin-view-drivers' component={AdminViewDrivers} />
            <Route exact path='/admin-edit-car/:id' component={AdminEditCar} />
            <Route exact path='/admin-edit-driver/:id' component={AdminEditDriver} />
            <Route exact path='/home' component={Home2} />
            <Route path='*' component={PageNotFound} />
        </Switch>
    </Layout>
);
