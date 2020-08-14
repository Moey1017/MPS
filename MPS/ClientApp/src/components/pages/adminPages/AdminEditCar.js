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
            var newCarObj = {
                registration: _this.state.registration,
                make: _this.state.make,
                model: _this.state.model,
                colour: _this.state.colour
                //driver: this.state.driver,
            };
            _this.props.updateCar(newCarObj);
        };
        _this.state = {
            registration: '',
            driver: '',
            make: '',
            model: '',
            colour: '',
            driverNameList: []
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
        this.props.fetchCar(this.props.carReg);
        this.setState({
            registration: this.props.carProps['car'].registration,
            make: this.props.carProps['car'].make,
            model: this.props.carProps['car'].model,
            colour: this.props.carProps['car'].colour
        });
        //if (this.state.driverNameList.length === 0) { // check if drivers have been loaded into redux store
        //    this.props.requestDriverList();
        //}
        //this.getDriverNameList();
    };
    // get all drivers'name into an array 
    //private getDriverNameList() {
    //    this.setState({
    //        driverNameList: this.props.drivers.map(d => { return d.name })
    //    })
    //}
    //private createDropDown() {
    //    return (
    //        <DropDownListComponent id="ddlelement" dataSource={this.state.driverNameList} placeholder="Select a driver" />
    //    );
    //}
    // States update late, need this to update component 
    AdminEditCar.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.carProps !== prevProps.carProps) {
            this.setState({
                registration: this.props.carProps['car'].registration,
                make: this.props.carProps['car'].make,
                model: this.props.carProps['car'].model,
                colour: this.props.carProps['car'].colour
            });
        }
    };
    AdminEditCar.prototype.render = function () {
        return (React.createElement("div", { className: "mpsContainer" },
            React.createElement(MpsHeader_1.MpsHeader, null),
            React.createElement("div", { className: "central_container " },
                React.createElement("div", { className: "text-center" },
                    React.createElement("h1", { className: "display-1" }, "Update Car")),
                React.createElement("div", { className: "row justify-content-center" },
                    React.createElement(reactstrap_1.Form, { onSubmit: this.handleSubmit },
                        React.createElement(reactstrap_1.FormGroup, null,
                            React.createElement(reactstrap_1.Label, { className: "d-block" }, "Select A Driver")),
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
                        React.createElement(react_router_dom_1.Link, { className: "btn btn-danger cus_btn mr-5", to: '/admin-view-cars' }, "Back"),
                        React.createElement(reactstrap_1.Button, { className: "btn btn-success cus_btn", type: "submit", onClick: this.handleSubmit }, "Update"))))));
    };
    return AdminEditCar;
}(React.Component));
function mapStateToProps(state, ownProps) {
    return {
        carProps: state.cars,
        driverProps: state.drivers,
        carReg: ownProps.match.params.id
    };
}
function mapDispatchToProps(dispatch) {
    return redux_1.bindActionCreators(__assign(__assign({}, CarStore.actionCreators), DriverStore.actionCreators), dispatch);
}
exports.default = react_redux_1.connect(
//(state: ApplicationState) => ({ cars:state.cars }),
mapStateToProps, mapDispatchToProps)(AdminEditCar);
//# sourceMappingURL=AdminEditCar.js.map