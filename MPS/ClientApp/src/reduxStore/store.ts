import { Action, Reducer, Store } from 'redux';
import { AppThunkAction } from './';
import { history } from '../index';
import axios from 'axios';
import { InboundOrder } from '../reduxStore/inboundOrder';
import { OutboundOrder } from '../reduxStore/outboundOrder';
import {
    HubConnectionBuilder,
    HubConnectionState,
    HubConnection,
} from '@aspnet/signalr';


// Frontend DB, to connect with the existing DB system 
export interface StoreState {
    readonly pallets: Pallet[];
    readonly isLoading: boolean;
    readonly hasSpace: boolean;
    readonly inbound_order: InboundOrder | null;
    readonly outbound_order: OutboundOrder | null;
    readonly signalR_connection: HubConnection | null;
}

export interface Pallet {
    readonly pallet_id: string;
    readonly car_reg: string | null;
}

// Variables
const SIGNALR_SERVER_URL = 'https://192.168.20.216:5006/socket/control-system';
// Order status names
const ACTIVE = "ACTIVE";
const ACCEPTED = "ACCEPTED";
const ERROR = "ERROR";
const COMPLETE = "COMPLETE";
const CANCELLED = "CANCELLED";
// Action names
const REQUEST_STORE_STATE = 'REQUEST_STORE_STATE';
const RECEIVE_STORE_STATE = 'RECEIVE_STORE_STATE';
const CREATE_INBOUND_ORDER = 'CREATE_INBOUND_ORDER';
const CREATE_OUTBOUND_ORDER = 'CREATE_OUTBOUND_ORDER';
const STORING_CAR = 'STORING_CAR';
const STORED_CAR = 'STORED_CAR';
const RETRIEVING_CAR = 'RETRIEVING_CAR';
const RETRIEVED_CAR = 'RETRIEVED_CAR';
const UPDATE_SPACE_STATUS = 'UPDATE_SPACE_STATUS';
const GETTING_ORDER_STATUS = 'GETTING_ORDER_STATUS';
const GOT_ORDER_STATUS = 'GOT_ORDER_STATUS';
const UPDATE_INBOUND_ORDER = 'UPDATE_INBOUND_ORDER';
const UPDATE_OUTBOUND_ORDER = 'UPDATE_OUTBOUND_ORDER';
const RECEIVED_ERROR_STATUS = 'RECEIVED_ERROR_STATUS';
const USER_CANCEL = 'USER_CANCEL';
const SETUP_SIGNALR_CONNECTION = 'SETUP_SIGNALR_CONNECTION';

//Types
interface RequestStoreStateAction {
    type: typeof REQUEST_STORE_STATE;
}

interface ReceiveStoreStateAction {
    type: typeof RECEIVE_STORE_STATE;
    pallets: Pallet[];
}

interface CreteInboundOrder {
    type: typeof CREATE_INBOUND_ORDER;
    inboundOrder: InboundOrder;
}

interface CreteOutboundOrder {
    type: typeof CREATE_OUTBOUND_ORDER;
    outboundOrder: OutboundOrder;
}

interface StoringCarAction {
    type: typeof STORING_CAR;
}

interface StoredCarAction {
    type: typeof STORED_CAR;
    pallet: Pallet;
}

interface RetrievingCarAction {
    type: typeof RETRIEVING_CAR;
}

interface RetrievedCarAction {
    type: typeof RETRIEVED_CAR;
    pallet: Pallet;
}

interface UpdateSpaceStatusAction {
    type: typeof UPDATE_SPACE_STATUS;
    hasSpace: boolean;
}

interface GettingOrderStatusAction {
    type: typeof GETTING_ORDER_STATUS;
}

interface GotOrderStatusAction {
    type: typeof GOT_ORDER_STATUS;
}

interface UpdateInboundOrderAction {
    type: typeof UPDATE_INBOUND_ORDER;
    inboundOrder: InboundOrder;
}

interface UpdateOutboundOrderAction {
    type: typeof UPDATE_OUTBOUND_ORDER;
    outboundOrder: OutboundOrder;
}

interface ReceiveErrorStatusAction {
    type: typeof RECEIVED_ERROR_STATUS
}

interface UserCancelAction {
    type: typeof USER_CANCEL
}

interface SetupSignalRConnection {
    type: typeof SETUP_SIGNALR_CONNECTION
    signalRConnection: HubConnection
}

//General Functions
//Get Order status, run function and dispatch
function getStatus(orderType: string, status: string, b_id: string, p_id: string, f: any | null, url: string | null, param: string | null, dispatch: any) {
    //Dispatch set loading to true 
    dispatch({ type: GETTING_ORDER_STATUS });
    //Getting from db
    axios.get('api/' + orderType + '/get-' + orderType + 'Order/' + b_id
        + '/' + p_id)
        .then(res => {
            console.log(res.data.status);

            if (res.data.status === status) {
                //Dispatch set loading to false
                console.log("Status changed to " + res.data.status);
                dispatch({ type: GOT_ORDER_STATUS });
                if (res.data.target) // check if outbound or inbound
                {
                    dispatch({ type: UPDATE_OUTBOUND_ORDER, outboundOrder: res.data }); // Outbound
                }
                else {
                    dispatch({ type: UPDATE_INBOUND_ORDER, inboundOrder: res.data }); // Inbound
                }
                //run Function/redirect
                if (f !== null) { f(url, param); }
            }
            else if (res.data.status === ERROR) {
                //Dispatch Error here to stop loading
                dispatch({ type: RECEIVED_ERROR_STATUS });
                redirectTo('/', "");
                alert("SYSTEM ERROR");
            }
            else if (res.data.status === CANCELLED) {
                dispatch({ type: USER_CANCEL });
                redirectTo('/', "");
                alert("SYSTEM CANCELLED");
            }
            else {
                setTimeout(() => { getStatus(orderType, status, b_id, p_id, f, url, param, dispatch); }, 2000);
            }
        }).catch(error => { console.log(error) })
}

function redirectTo(url: string, para: string | null) {
    history.push(url + para);// Redirect to store confirmation 
}



// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
// Aggregate all actions together and to ensure will only receive these actions 
type StoreAction = RequestStoreStateAction | ReceiveStoreStateAction | StoringCarAction
    | StoredCarAction | RetrievingCarAction | RetrievedCarAction | UpdateSpaceStatusAction
    | CreteInboundOrder | CreteOutboundOrder | GettingOrderStatusAction | GotOrderStatusAction
    | UpdateInboundOrderAction | UpdateOutboundOrderAction | ReceiveErrorStatusAction
    | UserCancelAction | SetupSignalRConnection;

export const actionCreators = {
    requestStoreState: (): AppThunkAction<StoreAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.cars) {
            dispatch({ type: REQUEST_STORE_STATE });
            axios.get('api/store/get-store-state')
                .then(res => {
                    if (res.data) {
                        dispatch({ type: RECEIVE_STORE_STATE, pallets: res.data })
                    } else {
                        console.log("requestStoreState did not receive any data.");
                    }
                }).catch(error => {
                    console.log("requestStoreState caught an error.");
                    //TODO:Create Dispatch type if error 
                })
        }
    },
    createInbound: (carRegToStore: string, redirectOption: boolean): AppThunkAction<StoreAction> => (dispatch) => { // check if valid first, if valid create inbound order with status ACTIVE
        dispatch({ type: STORING_CAR });                                                    // else create inbound order with status ERROR 

        // Create inbound Order 
        let b_id = new Date().valueOf().toString();
        const inboundOrder: InboundOrder =
        {
            batch_id: b_id, // Created with Unix and carReg Number
            pallet_id: carRegToStore,
            order_pallet_count: 1,
            expected_activation_time: null,
            sku_name: 'CAR',
            sku_code: 'CAR',
            status: ACTIVE, //ENUM ?? 
            max_pallet_height: 1000,
            pallet_width: 10000,
            wms_receipt_link_id: null,
            wms_request_status_read: null,
            wms_storage_status_read: null
        };

        //Validate Car reg 
        axios.get('api/car/get-car-byReg' + carRegToStore)
            .then(res => {
                if (res.data !== '') {
                    // Car valid
                    console.log("Car Reg was registered");

                    axios.get('api/store/ifCarExistStore' + carRegToStore)
                        .then(res => {
                            if (res.data === false) {
                                console.log("Car Reg is valid");

                                // Insert inbound order
                                axios.post('api/inbound/insert-inboundOrder', inboundOrder)
                                    .then(res => {
                                        if (res.status === 201 && res.data == true) {
                                            console.log("Inserted inbound order.");

                                            dispatch({ type: CREATE_INBOUND_ORDER, inboundOrder: inboundOrder });
                                            //Get inbound status
                                            if (redirectOption) {
                                                getStatus("inbound", ACCEPTED, inboundOrder.batch_id, inboundOrder.pallet_id,
                                                    redirectTo, '/store-confirmation/', carRegToStore, dispatch);
                                            } else {
                                                getStatus("inbound", ACCEPTED, inboundOrder.batch_id, inboundOrder.pallet_id,
                                                    null, '', carRegToStore, dispatch);
                                            }
                                        }
                                    }).catch(error => { console.log(error); })
                            }
                        }).catch(error => { console.log("someting went wrong while checking if car exist in store.") });
                } else {
                    // car not valid 
                    alert("Car reg doesnt existed, please re-enter.");
                    //inboundOrder.status = ERROR;
                    //// Insert inbound order with status ERROR 
                    //axios.post('api/inbound/insert-inboundOrder', inboundOrder)
                    //    .then(res => {
                    //        if (res.status === 201 && res.data == true) {
                    //            console.log("Inserted inbound order.");

                    //            dispatch({ type: CREATE_INBOUND_ORDER, inboundOrder: inboundOrder });
                    //        }
                    //        else {
                    //            console.log("Something went wrong while inserting inbound order");
                    //        }
                    //    }).catch(error => { console.log(error); })
                }
            }).catch(error => {
                console.log("fetchCar in storeCar caught an error.");
            })
    },
    storeCar: (carRegToStore: string, batch_id: string, pallet_id: string): AppThunkAction<StoreAction> => (dispatch) => {
        function storeAndRedirect() {
            const pallet: Pallet = {
                pallet_id: "0",
                car_reg: carRegToStore
            }

            //Put car into store 
            axios.put('api/store/store-car', pallet)
                .then(res => {
                    if (res.status === 202 && res.data !== '') {
                        //Dispatch Stored car , need to some how get the actual pallet id
                        dispatch({ type: STORED_CAR, pallet: res.data });

                        console.log("Car has been successfully stored.")
                        //history.push('/');// Redirect to home
                    }
                    else {
                        console.log("Something went wrong while storing the car into car store");
                    }
                }).catch(error => {
                    alert("Car reg has found in store./storeCar caught an error while storing.")
                    dispatch({ type: USER_CANCEL });
                    redirectTo('/', '');
                })
        }
        //Get inbound Status
        getStatus("inbound", COMPLETE, batch_id, pallet_id, storeAndRedirect, null, null, dispatch);
    },
    createOutbound: (carRegToRetrieve: string): AppThunkAction<StoreAction> => (dispatch) => {
        dispatch({ type: RETRIEVING_CAR });

        let b_id = new Date().valueOf().toString();
        const outboundOrder: OutboundOrder = {
            batch_id: b_id,
            pallet_id: carRegToRetrieve,
            order_pallet_count: 1,
            expected_activation_time: null,
            status: ACTIVE,
            index: 0,
            source: null,
            wms_link_id: null,
            wms_request_status_read: null,
            wms_output_status_read: null,
            automated_activation_time: null,
            target: 100001
        }

        //Check if Car valid in store
        axios.get('api/store/ifCarExistStore' + carRegToRetrieve)
            .then(res => {
                if (res.data === true) {
                    console.log("Car reg is exist in the store and ready to be retrieve.")
                    axios.post('api/outbound/insert-outboundOrder', outboundOrder)
                        .then(res => {
                            if (res.status === 201 && res.data == true) {
                                console.log("Inserted outbound order.");
                                dispatch({ type: CREATE_OUTBOUND_ORDER, outboundOrder: outboundOrder })

                                //Get inbound status
                                getStatus("outbound", ACCEPTED, outboundOrder.batch_id, outboundOrder.pallet_id,
                                    null, null, null, dispatch);
                            }
                        }).catch(error => {
                            console.log("retrieveCar caught an error./Failed to insert outbound order.")
                        })
                }
                else {
                    alert("Car Reg is not found in the store");
                    redirectTo('/retrieve-vehicle', "");
                }
            }).catch(error => {
                console.log("Something went wrong while update status in outbound order.");
            })
    },
    //Use to confirm exit also, when user press OK
    retrieveCar: (carRegToRetrieve: string): AppThunkAction<StoreAction> => (dispatch) => {
        axios.put('api/store/retrieve-car' + carRegToRetrieve)
            .then(res => {
                if (res.status === 202 && res.data !== '') {
                    console.log("Car has been retrieved.");
                    dispatch({ type: RETRIEVED_CAR, pallet: res.data });
                    redirectTo('/', "");// Redirect to home
                }
                else {
                    console.log("Car was not successfully retrieved.")
                }
            }).catch(error => {
                console.log("something went wrong while retriving Car from the store.");
            })
    },
    //Check if there's space in the store
    checkIfStoreHasSpace: (): AppThunkAction<StoreAction> => (dispatch) => {
        axios.get('api/store/ifHasSpace')
            .then(res => {
                dispatch({ type: UPDATE_SPACE_STATUS, hasSpace: res.data })
            }).catch(error => { console.log("something went wrong while checking space in store.") })
    },
    //When user Cancel
    userCancelAndReturn: (orderType: string, order: any): AppThunkAction<StoreAction> => (dispatch) => {
        //if (order !== null) {
        //    // update the order status to Cancelled when user cancel 
        //    order.status = CANCELLED;
        //    axios.put('api/' + orderType + '/update-' + orderType + 'Status', order)
        //        .then(res => {
        //            if (res.status === 202) {
        //                console.log("Order has been cancelled.");
        //            }
        //        }).catch(error => {
        //            console.log("Something went wrong while updating order status to cancel");
        //        })
        //}
        dispatch({ type: USER_CANCEL });
        redirectTo('/', "");
    },
    setUpSignalRConnection: (): AppThunkAction<StoreAction> => (dispatch) => {
        //set up SignalR Connection
        const connection = new HubConnectionBuilder()
            .withUrl(SIGNALR_SERVER_URL)
            .withAutomaticReconnect()
            .build();

        // use parameter to define what to listen to 
        //hubConnection.on('', (message) => {});

        // Starts the SignalR connection
        connection.start().then(() => {
            if (connection.connectionId) {
                dispatch({ type: SETUP_SIGNALR_CONNECTION, signalRConnection: connection });
                console.log("Connection has been set up, ID:" + connection.connectionId)
            }
        }).catch(error => { console.log('Error while establishing connection :('); });
    },
    createOutbound2: (carRegToRetrieve: string): AppThunkAction<StoreAction> => (dispatch) => {
        dispatch({ type: RETRIEVING_CAR });

        let b_id = new Date().valueOf().toString();
        const outboundOrder: OutboundOrder = {
            batch_id: b_id,
            pallet_id: carRegToRetrieve,
            order_pallet_count: 1,
            expected_activation_time: null,
            status: ACTIVE,
            index: 0,
            source: null,
            wms_link_id: null,
            wms_request_status_read: null,
            wms_output_status_read: null,
            automated_activation_time: null,
            target: 100001
        }

        axios.post('api/outbound/insert-outboundOrder', outboundOrder)
            .then(res => {
                if (res.status === 201 && res.data == true) {
                    console.log("Inserted outbound order.");
                }
            }).catch(error => {
                console.log("retrieveCar caught an error./Failed to insert outbound order.")
            })
    }
}

const unloadedStoreState: StoreState = {
    pallets: [], isLoading: false, hasSpace: false, inbound_order: null, outbound_order: null, signalR_connection: null
};

export const reducer: Reducer<StoreState> = (state: StoreState | undefined, incomingAction: StoreAction): StoreState => {
    if (state === undefined) {
        return unloadedStoreState;
    }

    const action = incomingAction as StoreAction; // to ensure will only receive these actions 
    switch (action.type) {
        case REQUEST_STORE_STATE:
            return {
                ...state,
                isLoading: true
            }
        case RECEIVE_STORE_STATE:
            return {
                ...state,
                pallets: action.pallets,
                isLoading: false
            }
        case CREATE_INBOUND_ORDER:
            return {
                ...state,
                inbound_order: action.inboundOrder
            }
        case CREATE_OUTBOUND_ORDER:
            return {
                ...state,
                outbound_order: action.outboundOrder
            }
        case STORING_CAR:
            return {
                ...state
            }
        case STORED_CAR:
            return {
                ...state,
                ...state.pallets.map(p => {
                    if (p.pallet_id === action.pallet.pallet_id) return action.pallet;
                    return p;
                }),
                inbound_order: null,
                isLoading: false
            }
        case RETRIEVING_CAR:
            return {
                ...state
            }
        case RETRIEVED_CAR:
            return {
                ...state,
                ...state.pallets.map(p => {
                    if (p.pallet_id === action.pallet.pallet_id) { return { pallet_id: action.pallet.pallet_id, car_reg: null } };
                    return p;
                }),
                outbound_order: null,
                isLoading: false
            }
        case UPDATE_SPACE_STATUS:
            return {
                ...state,
                hasSpace: action.hasSpace
            }
        case GETTING_ORDER_STATUS:
            return {
                ...state,
                isLoading: true
            }
        case GOT_ORDER_STATUS:
            return {
                ...state,
                isLoading: false
            }
        case UPDATE_INBOUND_ORDER:
            return {
                ...state,
                inbound_order: action.inboundOrder
            }
        case UPDATE_OUTBOUND_ORDER:
            return {
                ...state,
                outbound_order: action.outboundOrder
            }
        case RECEIVED_ERROR_STATUS:
            return {
                ...state,
                isLoading: false,
                inbound_order: null,
                outbound_order: null
            }
        case USER_CANCEL:
            return {
                ...state,
                isLoading: false,
                inbound_order: null,
                outbound_order: null
            }
        case SETUP_SIGNALR_CONNECTION:
            return {
                ...state,
                signalR_connection: action.signalRConnection
            }
        default:
            return {
                ...state
            }
    }

}

