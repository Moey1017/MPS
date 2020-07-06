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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_router_dom_1 = require("react-router-dom");
var ej2_react_dropdowns_1 = require("@syncfusion/ej2-react-dropdowns");
var DriverStore = require("../../../reduxStore/driver");
var reactstrap_1 = require("reactstrap");
var react_redux_1 = require("react-redux");
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
                driver: _this.state.driver,
                make: _this.state.make,
                model: _this.state.model,
                colour: _this.state.colour
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
            _this.ensureCarDataFetched();
            _this.getDriverNameList();
        }, 200);
    };
    AdminEditCar.prototype.ensureCarDataFetched = function () {
        if (this.state.driverNameList.length === 0) { // check if drivers have been loaded into redux store
            this.props.requestDriverList();
        }
    };
    AdminEditCar.prototype.getDriverNameList = function () {
        this.setState({
            driverNameList: this.props.drivers.map(function (d) { return d.name; })
        });
    };
    AdminEditCar.prototype.createDropDown = function () {
        return (React.createElement(ej2_react_dropdowns_1.DropDownListComponent, { id: "ddlelement", dataSource: this.state.driverNameList, placeholder: "Select a driver" }));
    };
    AdminEditCar.prototype.render = function () {
        return (React.createElement("div", { className: "container mh-100 b-banner-image" },
            React.createElement("h1", { className: "display-1 p-center-car" }, "Register Car"),
            React.createElement("div", { className: "row fixed-bottom justify-content-center cus-margin-l" },
                React.createElement(reactstrap_1.Form, { onSubmit: this.handleSubmit },
                    React.createElement(reactstrap_1.FormGroup, null,
                        React.createElement(reactstrap_1.Label, { className: "d-block" }, "Select A Driver"),
                        this.createDropDown()),
                    React.createElement(reactstrap_1.FormGroup, null,
                        React.createElement(reactstrap_1.Label, { className: "d-block" }, "Car Registration"),
                        React.createElement(reactstrap_1.Input, { className: "d-block mb-3 cus-input-driver", placeholder: "Enter car registration", name: "registration", value: this.state.registration, onChange: this.handleChange })),
                    React.createElement(reactstrap_1.FormGroup, null,
                        React.createElement(reactstrap_1.Label, { className: "d-block" }, "Car Make"),
                        React.createElement(reactstrap_1.Input, { className: "d-block mb-3 cus-input-driver", placeholder: "Enter make", name: "make", value: this.state.make, onChange: this.handleChange })),
                    React.createElement(reactstrap_1.FormGroup, null,
                        React.createElement(reactstrap_1.Label, { className: "d-block" }, "Car Model"),
                        React.createElement(reactstrap_1.Input, { className: "d-block mb-3 cus-input-driver", placeholder: "Enter car model", name: "model", value: this.state.model, onChange: this.handleChange })),
                    React.createElement(reactstrap_1.FormGroup, null,
                        React.createElement(reactstrap_1.Label, { className: "d-block" }, "Car Colour"),
                        React.createElement(reactstrap_1.Input, { className: "d-block mb-3 cus-input-driver", placeholder: "Enter car colour", name: "colour", value: this.state.colour, onChange: this.handleChange })),
                    React.createElement(react_router_dom_1.Link, { className: "btn btn-danger cus-btn mr-5", to: '/admin-options' }, "Back"),
                    React.createElement(reactstrap_1.Button, { className: "btn  btn-success cus-btn", type: "submit", onClick: this.handleSubmit }, "Register")))));
    };
    return AdminEditCar;
}(React.Component));
exports.default = react_redux_1.connect(function (state) { return state.drivers; }, //here
DriverStore.actionCreators)(AdminEditCar);
//# sourceMappingURL=AdminEditCar.js.map