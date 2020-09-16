"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_router_dom_1 = require("react-router-dom");
var DriverStore = require("../../../reduxStore/driver");
var CarStore = require("../../../reduxStore/car");
var reactstrap_1 = require("reactstrap");
var react_redux_1 = require("react-redux");
var redux_1 = require("redux");
var MpsHeader_1 = require("../../others/MpsHeader");
var Screens_1 = require("../../others/Screens");
var AdminStore = require("../../../reduxStore/admin");
var AdminEditCar = /** @class */ (function (_super) {
    __extends(AdminEditCar, _super);
    function AdminEditCar(props) {
        var _this = _super.call(this, props) || this;
        _this.handleChange = function (e) {
            var _a;
            _this.setState((_a = {}, _a[e.target.name] = e.target.value, _a));
        };
        _this.handleSubmit = function (e) {
            e.preventDefault();
            var formInputState = _this.validate();
            if (Object.keys(formInputState).every(function (index) { return formInputState[index]; })) { // check while submitting the form
                var carObj = {
                    registration: _this.state.registration,
                    make: _this.state.make,
                    model: _this.state.model,
                    colour: _this.state.colour,
                    driver_id: _this.state.driver_id
                };
                if (_this.state.driver_id == -1) {
                    carObj.driver_id = null;
                }
                else {
                    carObj.driver_id = parseInt(carObj.driver_id);
                }
                _this.props.updateCar(carObj);
            }
            else { // invalid inputs in form
                alert('Form Criteria has not been met!');
                return;
            }
        };
        _this.state = {
            registration: '',
            driver_id: -1,
            make: '',
            model: '',
            colour: ''
        };
        return _this;
    }
    AdminEditCar.prototype.componentDidMount = function () {
        var _this = this;
        setTimeout(function () {
            _this.ensureDataFetched();
        }, 200);
    };
    //getting all necessary data 
    AdminEditCar.prototype.ensureDataFetched = function () {
        if (this.props.drivers.length === 0) {
            this.props.requestDriverList();
        }
        this.props.fetchCar(this.props.match.params.car_reg);
        if (this.props.car.driver_id === null) {
            this.setState({
                driver_id: -1
            });
        }
        else {
            this.setState({
                driver_id: this.props.car.driver_id
            });
        }
        this.setState({
            registration: this.props.car.registration,
            make: this.props.car.make,
            model: this.props.car.model,
            colour: this.props.car.colour
        });
    };
    // States update late, need this to update component 
    AdminEditCar.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.car !== prevProps.car) {
            if (this.props.car.driver_id === null) {
                this.setState({
                    driver_id: -1
                });
            }
            else {
                this.setState({
                    driver_id: this.props.car.driver_id
                });
            }
            this.setState({
                registration: this.props.car.registration,
                make: this.props.car.make,
                model: this.props.car.model,
                colour: this.props.car.colour
            });
        }
    };
    AdminEditCar.prototype.validateRegistration = function () {
        return this.state.registration.length >= 3;
    };
    AdminEditCar.prototype.validate = function () {
        var registration = this.state.registration;
        return {
            registration: this.validateRegistration()
        };
    };
    AdminEditCar.prototype.render = function () {
        if (this.props.login_id) {
            return (React.createElement("div", { className: "mpsContainer" },
                React.createElement(MpsHeader_1.MpsHeader, null),
                React.createElement("div", { className: "central_container " },
                    React.createElement("div", { className: "text-center" },
                        React.createElement("h1", null, "Update Car")),
                    React.createElement("div", { className: "row justify-content-center" },
                        React.createElement(reactstrap_1.Form, { onSubmit: this.handleSubmit },
                            React.createElement(reactstrap_1.FormGroup, null,
                                React.createElement(reactstrap_1.Label, { className: "d-block" }, "Select A Driver"),
                                React.createElement("select", { className: "d-block mb-3 cus-input-driver", value: this.state.driver_id, name: "driver_id", onChange: this.handleChange },
                                    React.createElement("option", { value: "-1" }, "None"),
                                    this.props.drivers.map(function (d) { return React.createElement("option", { key: d.driver_id, value: d.driver_id },
                                        d.driver_id,
                                        " - ",
                                        d.name); }))),
                            React.createElement(reactstrap_1.FormGroup, null,
                                React.createElement(reactstrap_1.Label, { className: "d-block" }, "Car Registration"),
                                React.createElement(reactstrap_1.Input, { className: "d-block mb-3 cus-input-driver", placeholder: "Enter car registration", name: "registration", value: this.state.registration || "", onChange: this.handleChange, disabled: true })),
                            React.createElement(reactstrap_1.FormGroup, null,
                                React.createElement(reactstrap_1.Label, { className: "d-block" }, "Car Make"),
                                React.createElement(reactstrap_1.Input, { className: "d-block mb-3 cus-input-driver", placeholder: "Enter make", name: "make", value: this.state.make || "", onChange: this.handleChange })),
                            React.createElement(reactstrap_1.FormGroup, null,
                                React.createElement(reactstrap_1.Label, { className: "d-block" }, "Car Model"),
                                React.createElement(reactstrap_1.Input, { className: "d-block mb-3 cus-input-driver", placeholder: "Enter car model", name: "model", value: this.state.model || "", onChange: this.handleChange })),
                            React.createElement(reactstrap_1.FormGroup, null,
                                React.createElement(reactstrap_1.Label, { className: "d-block" }, "Car Colour"),
                                React.createElement(reactstrap_1.Input, { className: "d-block mb-3 cus-input-driver", placeholder: "Enter car colour", name: "colour", value: this.state.colour || "", onChange: this.handleChange })),
                            React.createElement(react_router_dom_1.Link, { className: "btn btn-danger mr-5 cus_form_btn", to: '/admin-view-cars' }, "Back"),
                            React.createElement(reactstrap_1.Button, { className: "btn btn-success cus_form_btn", type: "submit", onClick: this.handleSubmit }, "Update"))))));
        }
        else {
            return (React.createElement(Screens_1.NoPermission, null));
        }
    };
    return AdminEditCar;
}(React.Component));
function mapStateToProps(state) {
    return __assign(__assign(__assign({}, state.cars), state.drivers), state.admin);
}
function mapDispatchToProps(dispatch) {
    return redux_1.bindActionCreators(__assign(__assign(__assign({}, CarStore.actionCreators), DriverStore.actionCreators), AdminStore.actionCreators), dispatch);
}
exports.default = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(AdminEditCar);
//# sourceMappingURL=AdminEditCar.js.map