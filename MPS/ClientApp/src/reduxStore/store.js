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
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
var axios_1 = require("axios");
// Action name 
var REQUEST_STORE_STATE = 'REQUEST_STORE_STATE';
var RECEIVE_STORE_STATE = 'RECEIVE_STORE_STATE';
var CREATE_INBOUND_ORDER = 'CREATE_INBOUND_ORDER';
var CREATE_OUTBOUND_ORDER = 'CREATE_OUTBOUND_ORDER';
var STORING_CAR = 'STORING_CAR';
var STORED_CAR = 'STORED_CAR';
var RETRIEVING_CAR = 'RETRIEVING_CAR';
var RETRIEVED_CAR = 'RETRIEVED_CAR';
var UPDATE_SPACE_STATUS = 'UPDATE_SPACE_STATUS';
var GETTING_ORDER_STATUS = 'GETTING_ORDER_STATUS';
var GOT_ORDER_STATUS = 'GOT_ORDER_STATUS';
var UPDATE_INBOUND_ORDER = 'UPDATE_INBOUND_ORDER';
var UPDATE_OUTBOUND_ORDER = 'UPDATE_OUTBOUND_ORDER';
//General Functions
//Get Order status, run function and dispatch
function getStatus(bound, status, b_id, p_id, f, url, param, dispatch) {
    //Dispatch set loading to true 
    dispatch({ type: GETTING_ORDER_STATUS });
    //Getting from db
    axios_1.default.get('api/' + bound + '/get-' + bound + 'Order/' + b_id
        + '/' + p_id)
        .then(function (res) {
        console.log(res.data.status);
        if (res.data.status === status) {
            //Dispatch set loading to false
            console.log("Status changed to " + res.data.status);
            dispatch({ type: GOT_ORDER_STATUS });
            if (res.data.target) // check if outbound or inbound
             {
                dispatch({ type: UPDATE_OUTBOUND_ORDER, outboundOrder: res.data });
                if (res.data.status === 'COMPLETED') {
                    //here ?? Dispatch Loading?
                }
            }
            else {
                dispatch({ type: UPDATE_INBOUND_ORDER, inboundOrder: res.data });
            }
            //redirect
            if (f !== null) {
                f(url, param);
            }
        }
        else if (res.data.status === "ERROR") {
            console.log("ERROR!");
        }
        else {
            console.log("Fetching...");
            setTimeout(function () { getStatus(bound, status, b_id, p_id, f, url, param, dispatch); }, 1000);
        }
    }).catch(function (error) { console.log(error); });
}
function redirectTo(url, para) {
    index_1.history.push(url + para); // Redirect to store confirmation 
}
exports.actionCreators = {
    requestStoreState: function () { return function (dispatch, getState) {
        var appState = getState();
        if (appState && appState.cars) {
            dispatch({ type: REQUEST_STORE_STATE });
            axios_1.default.get('api/store/get-store-state')
                .then(function (res) {
                if (res.data) {
                    dispatch({ type: RECEIVE_STORE_STATE, pallets: res.data });
                }
                else {
                    console.log("requestStoreState did not receive any data.");
                }
            }).catch(function (error) {
                console.log("requestStoreState caught an error.");
                //TODO:Create Dispatch type if error 
            });
        }
    }; },
    // getting car reg in the param of storing car
    // dispatch storing car => axios call create inbound order => status:ACTIVE
    // axios call ifRegExist -> true -> dispatch stored car => udpate current state => -> axios call update status:COMPLETE
    //                         false -> dispatch carNotFound -> axios call update status: ERROR/DECLINED?
    createInbound: function (carRegToStore) { return function (dispatch) {
        var carValid = false;
        dispatch({ type: STORING_CAR });
        // Create inbound Order 
        var b_id = Date.now() + carRegToStore;
        var inboundOrder = {
            batch_id: b_id,
            pallet_id: carRegToStore,
            order_pallet_count: 1,
            expected_activation_time: null,
            sku_name: 'Car',
            sku_code: 'Car',
            status: 'ACTIVE',
            max_pallet_height: 1000,
            pallet_width: 10000,
            wms_receipt_link_id: null,
            wms_request_status_read: null,
            wms_storage_status_read: null
        };
        // Insert inbound order, need to use await but doesnt work 
        axios_1.default.post('api/inbound/insert-inboundOrder', inboundOrder)
            .then(function (res) {
            if (res.status === 201 && res.data == true) {
                console.log("Inserted inbound order.");
                dispatch({ type: CREATE_INBOUND_ORDER, inboundOrder: inboundOrder });
            }
        }).catch(function (error) { console.log(error); });
        //Get inbound status
        getStatus("inbound", "ACCEPTED", inboundOrder.batch_id, inboundOrder.pallet_id, redirectTo, '/store-confirmation/', carRegToStore, dispatch);
        //Check if Car reg is existed in database by getting it, then change the status to Accepted
        axios_1.default.get('api/car/get-car-byReg' + carRegToStore)
            .then(function (res) {
            if (res.data !== '') {
                console.log("Car Reg valid");
                carValid = true;
                //// SOMEHOW DETECT WHEN DONE, Check Status if Complete or Error
                if (carValid) {
                    inboundOrder.status = 'ACCEPTED';
                }
                axios_1.default.put('api/inbound/update-inboundStatus', inboundOrder)
                    .then(function (res) {
                    if (res.data !== '') {
                        console.log("update order successfully.");
                    }
                    else {
                        console.log("Something went wrong while updating order to Accepted.");
                    }
                }).catch(function (error) {
                    console.log("storeCar caught an error while updating status to COMPLETE.");
                });
            }
            else {
                // not exist then AXIOS CALL update status to ERROR?
                alert("Car reg doesnt existed, please re-enter.");
                //inboundOrder.status = 'ERROR';
                //                    console.log(inboundOrder);
                //                    axios.put('api/inbound/update-inboundStatus', inboundOrder)
                //                        .then(res => {
                //                            if (res.data !== '') {
                //                                console.log("updated order to ERROR.");
                //                            }
                //                        }).catch(error => { console.log("Something went wrong while update status to ERROR."); })
                //                })
            }
        }).catch(function (error) {
            console.log("fetchCar in storeCar caught an error.");
            //TODO:Create Dispatch type if error 
        });
    }; },
    storeCar: function (carRegToStore, batch_id, pallet_id) { return function (dispatch) {
        function storeAndRedirect() {
            var pallet = {
                pallet_id: "0",
                car_reg: carRegToStore
            };
            //Put car into store 
            axios_1.default.put('api/store/store-car', pallet)
                .then(function (res) {
                if (res.status === 202 && res.data !== '') {
                    //Dispatch Stored car , need to some how get the actual pallet id
                    dispatch({ type: STORED_CAR, pallet: res.data });
                    console.log("Car has been successfully stored.");
                    index_1.history.push('/'); // Redirect to home
                }
                else {
                    console.log("Something went wrong while storing the car into car store");
                }
            }).catch(function (error) {
                console.log("storeCar caught an error while storing./Car reg is found in store.");
                //TODO: DISPATCH STORE FAILED
            });
        }
        //Get inbound Status
        getStatus("inbound", "COMPLETED", batch_id, pallet_id, storeAndRedirect, null, null, dispatch);
        //Create store Object, update state 
    }; },
    createOutbound: function (carRegToRetrieve) { return function (dispatch) {
        dispatch({ type: RETRIEVING_CAR });
        var b_id = Date.now() + carRegToRetrieve;
        var outboundOrder = {
            batch_id: b_id,
            pallet_id: carRegToRetrieve,
            order_pallet_count: 1,
            expected_activation_time: null,
            status: "ACTIVE",
            index: 0,
            source: null,
            wms_link_id: null,
            wms_request_status_read: null,
            wms_output_status_read: null,
            automated_activation_time: null,
            target: 1000001
        };
        axios_1.default.post('api/outbound/insert-outboundOrder', outboundOrder)
            .then(function (res) {
            if (res.status === 201 && res.data == true) {
                console.log("Inserted outbound order.");
                dispatch({ type: CREATE_OUTBOUND_ORDER, outboundOrder: outboundOrder });
                //Check if Car valid in store
                axios_1.default.get('api/outbound/ifCarRegExist' + carRegToRetrieve)
                    .then(function (res) {
                    if (res.data === true) {
                        console.log("Car reg is found in the store.");
                        // UPDATE STATUS => ACCEPTED
                        // SOMEHOW DETECT WHEN DONE,Check Status if Complete or Error
                        //outBoundOrder.status = 'COMPLETED';
                        //axios.put('api/outbound/update-outboundStatus', outBoundOrder)
                        //    .then(res => {
                        //        if (res.data !== '') {
                        //            console.log("update outbound order successfully.");
                        //            // axios call retrieve car from store
                        //            axios.put('api/store/retrieve-car' + carRegToRetrieve)
                        //                .then(res => {
                        //                    if (res.status === 202) {
                        //                        console.log("Car has been retrieved.");
                        //                        history.push('/');// Redirect to home
                        //                    }
                        //                    else {
                        //                        console.log("Car was not successfully retrieved.")
                        //                    }
                        //                }).catch(error => {
                        //                    console.log("something went wrong in retrieveCar.");
                        //                })
                        //            // dispatch Retrieved Car
                        //        }
                        //        else {
                        //            console.log("Something went wrong while updating outbound order.");
                        //        }
                        //    }).catch(error => {
                        //        console.log("retrieveCar does not receive any data/Car reg doesnt existed.");
                        //    })
                        //Get inbound status
                        getStatus("outbound", "COMPLETED", outboundOrder.batch_id, outboundOrder.pallet_id, null, null, null, dispatch);
                    }
                }).catch(function (error) {
                    console.log("Something went wrong while update status in outbound order.");
                });
            }
        }).catch(function (error) {
            console.log("retrieveCar caught an error./Failed to insert outbound order.");
        });
    }; },
    //Use to confirm exit also, when user press OK
    retrieveCar: function (carRegToRetrieve) { return function (dispatch) {
        axios_1.default.put('api/store/retrieve-car' + carRegToRetrieve)
            .then(function (res) {
            if (res.status === 202 && res.data !== '') {
                console.log("Car has been retrieved.");
                console.log(res.data);
                dispatch({ type: RETRIEVED_CAR, pallet: res.data });
                redirectTo('/', ""); // Redirect to home
            }
            else {
                console.log("Car was not successfully retrieved.");
            }
        }).catch(function (error) {
            console.log("something went wrong in retrieveCar.");
        });
    }; },
    // dispatch retriving car => create outbound order => status:ACTIVE/ACCEPTED 
    // dispatch stored car => udpate current state 
    retrieveCar2: function (carRegToRetrieve) { return function (dispatch) {
        //Create outbound Order 
        var b_id = Date.now() + carRegToRetrieve;
        var outBoundOrder = {
            batch_id: b_id,
            pallet_id: carRegToRetrieve,
            order_pallet_count: 1,
            expected_activation_time: null,
            status: "ACTIVE",
            index: 0,
            source: null,
            wms_link_id: null,
            wms_request_status_read: null,
            wms_output_status_read: null,
            automated_activation_time: null,
            target: 1000001
        };
        axios_1.default.post('api/outbound/insert-outboundOrder', outBoundOrder)
            .then(function (res) {
            if (res.status === 201 && res.data == true) {
                console.log("Inserted outbound order.");
                //Check if Car valid in store
                axios_1.default.get('api/outbound/ifCarRegExist' + carRegToRetrieve)
                    .then(function (res) {
                    if (res.data === true) {
                        console.log("Car reg is found in the store.");
                        // SOMEHOW DETECT WHEN DONE,Check Status if Complete or Error
                        //outBoundOrder.status = 'COMPLETED';
                        //axios.put('api/outbound/update-outboundStatus', outBoundOrder)
                        //    .then(res => {
                        //        if (res.data !== '') {
                        //            console.log("update outbound order successfully.");
                        //            // axios call retrieve car from store
                        //            axios.put('api/store/retrieve-car' + carRegToRetrieve)
                        //                .then(res => {
                        //                    if (res.status === 202) {
                        //                        console.log("Car has been retrieved.");
                        //                        history.push('/');// Redirect to home
                        //                    }
                        //                    else {
                        //                        console.log("Car was not successfully retrieved.")
                        //                    }
                        //                }).catch(error => {
                        //                    console.log("something went wrong in retrieveCar.");
                        //                })
                        //            // dispatch Retrieved Car
                        //        }
                        //        else {
                        //            console.log("Something went wrong while updating outbound order.");
                        //        }
                        //    }).catch(error => {
                        //        console.log("retrieveCar does not receive any data/Car reg doesnt existed.");
                        //    })
                    }
                }).catch(function (error) {
                    console.log("Something went wrong while update status in outbound order.");
                });
            }
        }).catch(function (error) {
            console.log("retrieveCar caught an error./Failed to insert outbound order.");
        });
    }; },
    //Check if there's space in the store
    checkIfStoreHasSpace: function () { return function (dispatch) {
        axios_1.default.get('api/store/ifHasSpace')
            .then(function (res) {
            dispatch({ type: UPDATE_SPACE_STATUS, hasSpace: res.data });
        }).catch(function (error) { console.log("something went wrong while checking space in store."); });
    }; }
};
var unloadedStoreState = {
    pallets: [], isLoading: false, hasSpace: false, inbound_order: null, outbound_order: null
};
exports.reducer = function (state, incomingAction) {
    if (state === undefined) {
        return unloadedStoreState;
    }
    var action = incomingAction; // to ensure will only receive these actions 
    switch (action.type) {
        case REQUEST_STORE_STATE:
            return __assign(__assign({}, state), { isLoading: true });
        case RECEIVE_STORE_STATE:
            return __assign(__assign({}, state), { pallets: action.pallets, isLoading: false });
        case CREATE_INBOUND_ORDER:
            return __assign(__assign({}, state), { inbound_order: action.inboundOrder });
        case CREATE_OUTBOUND_ORDER:
            return __assign(__assign({}, state), { outbound_order: action.outboundOrder });
        case STORING_CAR:
            return __assign({}, state);
        case STORED_CAR:
            return __assign(__assign(__assign({}, state), state.pallets.map(function (p) {
                if (p.pallet_id === action.pallet.pallet_id)
                    return action.pallet;
                return p;
            })), { inbound_order: null, isLoading: false });
        case RETRIEVING_CAR:
            return __assign({}, state);
        case RETRIEVED_CAR:
            return __assign(__assign(__assign({}, state), state.pallets.map(function (p) {
                if (p.pallet_id === action.pallet.pallet_id) {
                    return { pallet_id: action.pallet.pallet_id, car_reg: null };
                }
                ;
                return p;
            })), { outbound_order: null, isLoading: false });
        case UPDATE_SPACE_STATUS:
            return __assign(__assign({}, state), { hasSpace: action.hasSpace });
        case GETTING_ORDER_STATUS:
            return __assign(__assign({}, state), { isLoading: true });
        case GOT_ORDER_STATUS:
            return __assign(__assign({}, state), { isLoading: false });
        case UPDATE_INBOUND_ORDER:
            return __assign(__assign({}, state), { inbound_order: action.inboundOrder });
        case UPDATE_OUTBOUND_ORDER:
            return __assign(__assign({}, state), { outbound_order: action.outboundOrder });
        default:
            return __assign({}, state);
    }
};
//# sourceMappingURL=store.js.map