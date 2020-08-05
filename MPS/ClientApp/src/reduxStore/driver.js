"use strict";
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
var axios_1 = require("axios");
// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
//Action names 
var REQUEST_DRIVER_LIST = 'REQUEST_DRIVER_LIST';
var RECEIVE_DRIVER_LIST = 'RECEIVE_DRIVER_LIST';
var INSERTING_DRIVER = 'INSERTING_DRIVER';
var INSERTED_DRIVER = 'INSERTED_DRIVER';
var DELETE_DRIVER = 'DELETE_DRIVER';
var UPDATE_DRIVER = 'UPDATE_DRIVER';
var FETCHING_DRIVER = 'FETCHING_DRIVER';
var FETCHED_DRIVER = " FETCHED_DRIVER";
// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
exports.actionCreators = {
    requestDriverList: function () { return function (dispatch, getState) {
        // Only load data if it's something we don't already have (and are not already loading)
        var appState = getState();
        if (appState && appState.drivers) {
            dispatch({ type: REQUEST_DRIVER_LIST });
            axios_1.default.get('api/driver/get-drivers')
                .then(function (res) {
                if (res.data) {
                    dispatch({ type: RECEIVE_DRIVER_LIST, drivers: res.data });
                }
                else {
                    console.log("requestDriverList did not receive any data.");
                }
            }).catch(function (error) {
                console.log("requestDriverList caught an error.");
                console.log(error);
                //TODO:Create Dispatch type if error 
            });
        }
    }; },
    insertDriver: function (driverFromClient) { return function (dispatch) {
        dispatch({ type: INSERTING_DRIVER, driver: driverFromClient });
        axios_1.default.post('api/driver/insert-driver', driverFromClient)
            .then(function (res) {
            if (res.status === 201 && res.data == true) {
                dispatch({ type: INSERTED_DRIVER, driver: driverFromClient }); // driver: data(driverFromDb From DBS)???
                console.log("Driver Added.");
                index_1.history.push('/admin-view-drivers'); //redirect back to view all drivers 
            }
            else {
                console.log("Something went wrong in insertDriver");
            }
        }).catch(function (error) {
            console.log("requestDriverList caught an error./Failed to insert");
            console.log(error);
            //TODO:Create Dispatch type if error 
        });
        //here
        //TODO:Create Dispatch type if error 
    }; },
    deleteDriver: function (driverIdToDelete) { return function (dispatch) {
        axios_1.default.delete('api/driver/delete-driver' + driverIdToDelete)
            .then(function (res) {
            if (res.status === 204) {
                dispatch({ type: DELETE_DRIVER, driver_id: driverIdToDelete });
                console.log('Driver Deleted.');
            }
            else {
                console.log("Driver Delete Failed.");
            }
        })
            .catch(function (error) {
            console.log("deleteDriver caught an error/Failed to delete.");
            console.log(error);
        });
    }; },
    fetchDriver: function (driverIdToGet) { return function (dispatch) {
        dispatch({ type: FETCHING_DRIVER, driver_id: driverIdToGet });
        axios_1.default.get('api/driver/get-driver-byID' + driverIdToGet)
            .then(function (res) {
            if (res.data !== '') {
                dispatch({ type: FETCHED_DRIVER, driver: res.data });
            }
            else {
                console.log("fetchDriver did not receive any data.");
            }
        }).catch(function (error) {
            console.log("fetchDriver caught an error.");
            console.log(error);
            //TODO:Create Dispatch type when get status code 404
        });
    }; },
    updateDriver: function (newDriver) { return function (dispatch) {
        axios_1.default.put('api/driver/update-driver', newDriver)
            .then(function (res) {
            if (res.status === 202) {
                dispatch({ type: UPDATE_DRIVER, driver: newDriver });
                console.log("Driver updated.");
                index_1.history.push('/admin-view-drivers'); //redirect back to view all drivers 
            }
            else
                console.log("Update Driver failed.");
        }).catch(function (error) {
            console.log("updateDriver caught an error.");
            console.log(error);
            //TODO:Create Dispatch type when get status code 404
        });
    }; }
};
// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
var unloadedDriverState = {
    drivers: [], driver: { driver_id: 0, name: '', tel_no: '', email: '' }, isLoading: false
};
exports.reducer = function (state, incomingAction) {
    if (state === undefined) {
        return unloadedDriverState;
    }
    var action = incomingAction; // to ensure will only receive these actions 
    switch (action.type) {
        case REQUEST_DRIVER_LIST:
            return __assign(__assign({}, state), { isLoading: true });
        case RECEIVE_DRIVER_LIST:
            return __assign(__assign({}, state), { drivers: action.drivers, isLoading: false });
        case INSERTING_DRIVER:
            return __assign(__assign({}, state), { isLoading: true });
        case INSERTED_DRIVER:
            return __assign(__assign({}, state), { drivers: __spreadArrays(state.drivers, [action.driver]), isLoading: false });
        case DELETE_DRIVER:
            return __assign(__assign({}, state), { drivers: __spreadArrays(state.drivers.filter(function (driver) { return driver.driver_id !== action.driver_id; })) });
        case UPDATE_DRIVER:
            return __assign(__assign({}, state), state.drivers.map(function (d) {
                if (d.driver_id === action.driver.driver_id)
                    return action.driver;
                return d;
            }));
        case FETCHING_DRIVER:
            return __assign(__assign({}, state), { isLoading: true });
        case FETCHED_DRIVER:
            return __assign(__assign({}, state), { driver: action.driver, isLoading: false });
        default:
            return __assign({}, state);
    }
};
//# sourceMappingURL=driver.js.map