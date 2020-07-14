"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_router_1 = require("react-router");
var Layout_1 = require("./components/Layout");
//Users Pages
var Home_1 = require("./components/pages/userPages/Home");
var Home2_1 = require("./components/pages/userPages/Home2");
var StoreVehicle_1 = require("./components/pages/userPages/StoreVehicle");
var RetrieveVehicle_1 = require("./components/pages/userPages/RetrieveVehicle");
var StoreConfirmation_1 = require("./components/pages/userPages/StoreConfirmation");
var RetrieveConfirmation_1 = require("./components/pages/userPages/RetrieveConfirmation");
//Admin Pages
var AdminLogin_1 = require("./components/pages/adminPages/AdminLogin");
var AdminOptions_1 = require("./components/pages/adminPages/AdminOptions");
var AdminRegisterDriver_1 = require("./components/pages/adminPages/AdminRegisterDriver");
var AdminRegisterCar_1 = require("./components/pages/adminPages/AdminRegisterCar");
var AdminViewCars_1 = require("./components/pages/adminPages/AdminViewCars");
var AdminViewDrivers_1 = require("./components/pages/adminPages/AdminViewDrivers");
var AdminEditCar_1 = require("./components/pages/adminPages/AdminEditCar");
var AdminEditDriver_1 = require("./components/pages/adminPages/AdminEditDriver");
//Public Pages 
var PageNotFound_1 = require("./components/pages/PageNotFound");
//CSS
require("./App.css");
exports.default = (function () { return (React.createElement(Layout_1.default, null,
    React.createElement(react_router_1.Switch, null,
        React.createElement(react_router_1.Route, { exact: true, path: '/', component: Home_1.default }),
        React.createElement(react_router_1.Route, { exact: true, path: '/store-vehicles', component: StoreVehicle_1.default }),
        React.createElement(react_router_1.Route, { exact: true, path: '/store-vehicle', component: StoreConfirmation_1.default }),
        React.createElement(react_router_1.Route, { exact: true, path: '/retrieve-vehicle', component: RetrieveVehicle_1.default }),
        React.createElement(react_router_1.Route, { exact: true, path: '/retrieve-confirmation/:car_reg', component: RetrieveConfirmation_1.default }),
        React.createElement(react_router_1.Route, { exact: true, path: '/admin-login', component: AdminLogin_1.default }),
        React.createElement(react_router_1.Route, { exact: true, path: '/admin-options', component: AdminOptions_1.default }),
        React.createElement(react_router_1.Route, { exact: true, path: '/admin-register-driver', component: AdminRegisterDriver_1.default }),
        React.createElement(react_router_1.Route, { exact: true, path: '/admin-register-car', component: AdminRegisterCar_1.default }),
        React.createElement(react_router_1.Route, { exact: true, path: '/admin-view-cars', component: AdminViewCars_1.default }),
        React.createElement(react_router_1.Route, { exact: true, path: '/admin-view-drivers', component: AdminViewDrivers_1.default }),
        React.createElement(react_router_1.Route, { exact: true, path: '/admin-edit-car/:id', component: AdminEditCar_1.default }),
        React.createElement(react_router_1.Route, { exact: true, path: '/admin-edit-driver/:id', component: AdminEditDriver_1.default }),
        React.createElement(react_router_1.Route, { exact: true, path: '/home', component: Home2_1.default }),
        React.createElement(react_router_1.Route, { path: '*', component: PageNotFound_1.default })))); });
//# sourceMappingURL=App.js.map