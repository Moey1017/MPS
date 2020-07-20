import { Action, Reducer, Store } from 'redux';
import { AppThunkAction } from './';
import { history } from '../index';
import axios from 'axios';
import { InboundOrder } from '../reduxStore/inboundOrder';
import { OutboundOrder } from '../reduxStore/outboundOrder';

// Another DB, to connect with the existing DB system 
export interface StoreState {
    readonly pallets: Pallet[];
    readonly isLoading: boolean;
}

export interface Pallet {
    readonly pallet_id: string;
    readonly car_reg: string | null; // change from Car Model to CarReg
}

////System loading State, not in DB
//export interface currentState {
//    readonly fetching: boolean;
//    // system status?? Enum? 
//}


// Action name 
const REQUEST_STORE_STATE = 'REQUEST_STORE_STATE';
const RECEIVE_STORE_STATE = 'RECEIVE_STORE_STATE';
const STORING_CAR = 'STORING_CAR';
const STORED_CAR = 'STORED_CAR';
const RETRIEVING_CAR = 'RETRIEVING_CAR';
const RETRIEVED_CAR = 'RETRIEVED_CAR';

//Types
interface RequestStoreStateAction {
    type: typeof REQUEST_STORE_STATE;
}

interface ReceiveStoreStateAction {
    type: typeof RECEIVE_STORE_STATE;
    pallets: Pallet[];
}

interface StoringCarAction {
    type: typeof STORING_CAR;
}

interface StoredCarAction {
    type: typeof STORED_CAR;
    pallets: Pallet;
}

interface RetrievingCarAction {
    type: typeof RETRIEVING_CAR;
}

interface RetrievedCarAction {
    type: typeof RETRIEVED_CAR;
    pallets: Pallet;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
// Aggregate all actions together and to ensure will only receive these actions 
type StoreAction = RequestStoreStateAction | ReceiveStoreStateAction | StoringCarAction | StoredCarAction;

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
                    console.log(error);
                    //TODO:Create Dispatch type if error 
                })
        }
    },
    // getting car reg in the param of storing car
    // dispatch storing car => axios call create inbound order => status:ACTIVE
    // axios call ifRegExist -> true -> dispatch stored car => udpate current state => -> axios call update status:COMPLETE
    //                         false -> dispatch carNotFound -> axios call update status: ERROR/DECLINED?
    storeCar: (carRegToStore: string): AppThunkAction<StoreAction> => (dispatch) => {
        dispatch({ type: STORING_CAR });
        // Create inbound Order 
        const inboundOrder: InboundOrder =
        {
            batch_id: carRegToStore, // Created with Unix and carReg Number in backend
            pallet_id: carRegToStore,
            order_pallet_count: 1,
            expected_activation_time: null,
            sku_name: 'Car',
            sku_code: 'Car',
            status: 'ACTIVE', //ENUM ?? 
            max_pallet_height: 1000,
            pallet_width: 10000,
            wms_receipt_link_id: null,
            wms_request_status_read: null,
            wms_storage_status_read: null
        };
        // Insert inbound order 
        axios.post('api/inbound/insert-inboundOrder', inboundOrder)
            .then(res => {
                if (res.status === 201 && res.data == true) {
                    console.log("Inserted inbound order.");

                    //Check if Car reg is existed in database by getting it 
                    axios.get('api/car/get-car-byReg' + carRegToStore)
                        .then(res => {
                            if (res.data !== '') {
                                //TODO:exist then AXIOS CALL update status to Accepted
                                console.log("Car Reg valid");

                                //WARNING!!!SKIP FROM ACCEPTED TO COMPLETE AT THE MOMENT 

                                // SOMEHOW DETECT WHEN DONE,update status to Completed (Maybe Seperate them in different function)
                                inboundOrder.status = 'COMPLETED';
                                axios.put('api/inbound/update-inboundStatus', inboundOrder)
                                    .then(res => {
                                        if (res.data !== '') {
                                            console.log("update order successfully.")

                                            //Create store Object 
                                            const pallet: Pallet = {
                                                pallet_id: "0",
                                                car_reg: carRegToStore
                                            }
                                            //Put car into store 
                                            axios.put('api/store/store-car', pallet)
                                                .then(res => {
                                                    if (res.status === 202) {
                                                        //TODO:Dispatch Stored car 
                                                        console.log("Car has been successfully stored.")
                                                        history.push('/');// Redirect to home
                                                    }
                                                    else {
                                                        console.log("Something went wrong while storing the car into car store");
                                                        console.log(res.data);
                                                    }
                                                }).catch(error => {
                                                    console.log("storeCar caught an error while storing.");
                                                    console.log(error);
                                                    //TODO: DISPATCH STORE FAILED 

                                                    inboundOrder.status = 'ERROR';
                                                    console.log(inboundOrder);
                                                    axios.put('api/inbound/update-inboundStatus', inboundOrder)
                                                        .then(res => {
                                                            if (res.data !== '') {
                                                                console.log("updated order to ERROR.");
                                                            }
                                                        }).catch(error => { console.log("Something went wrong while update status to ERROR."); })
                                                })
                                        }
                                        else {
                                            console.log("something went wrong in storeCar while updating status to COMPLETE.")
                                        }
                                    }).catch(error => {
                                        console.log("storeCar caught an error while updating status to COMPLETE.");
                                        console.log(error);
                                    })


                            } else {
                                // not exist then AXIOS CALL update status to ERROR?
                                console.log("storeCar do not receive any data from fetch car./Car reg do not exist in databse.");
                            }
                        }).catch(error => {
                            console.log("fetchCar in storeCar caught an error.");
                            console.log(error);
                            //TODO:Create Dispatch type if error 
                        })
                }
                else {
                    console.log("Something went wrong in storeCar.");
                }
            }).catch(error => {
                console.log("storeCar caught an error./Failed to insert inbound order.");
                console.log(error);
            })
    },
    // dispatch retriving car => create outbound order => status:ACTIVE/ACCEPTED 
    // dispatch stored car => udpate current state 
    retrieveCar: (carRegToRetrieve: string): AppThunkAction<StoreAction> => (dispatch) => {
        //Create outbound Order 
        const outBoundOrder: OutboundOrder = {
            batch_id: carRegToRetrieve,
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
        }
        axios.post('api/outbound/insert-outboundOrder', outBoundOrder)
            .then(res => {
                if (res.status === 201 && res.data == true) {
                    console.log("Inserted outbound order.");

                    //Check if Car valid in store
                    console.log(carRegToRetrieve);
                    axios.get('api/outbound/ifCarRegExist' + carRegToRetrieve)
                        .then(res => {
                            console.log(res);
                            if (res.data === true) {
                                console.log("Car reg is valid.")

                                //WARNING!!!SKIP FROM ACCEPTED TO COMPLETE AT THE MOMENT 

                                // SOMEHOW DETECT WHEN DONE,update status to Completed (Maybe Seperate them in different function)
                                outBoundOrder.status = 'COMPLETED';
                                axios.put('api/outbound/update-outboundStatus', outBoundOrder)
                                    .then(res => {
                                        if (res.data !== '') {
                                            console.log("update outbound order successfully.");

                                            // axios call retrieve car from store
                                            axios.put('api/store/retrieve-car' + carRegToRetrieve)
                                                .then(res => {
                                                    if (res.status === 202) {
                                                        console.log("Car has been retrieved.");
                                                        history.push('/');// Redirect to home
                                                    }
                                                    else {
                                                        console.log("Car was not successfully retrieved.")
                                                    }
                                                }).catch(error => {
                                                    console.log("something went wrong in retrieveCar.");
                                                })
                                            // dispatch Retrieved Car
                                        }
                                        else {
                                            console.log("Car reg doesnt existed.");
                                        }
                                    }).catch(error => {
                                        console.log("retrieveCar does not receive any data/Car reg doesnt existed.");
                                        console.log(error);
                                    })
                            }
                        }).catch(error => {
                            console.log("Something went wrong while update status in outbound order.")
                            console.log(error);
                        })
                }
            }).catch(error => {
                console.log("retrieveCar caught an error./Failed to insert outbound order.")
            })
    }
}

const unloadedStoreState: StoreState = {
    pallets: [], isLoading: false
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
        case STORING_CAR:
            return {
                ...state,
                isLoading: true
            }
        case STORED_CAR:
            return {
                ...state,
                //update pallet with the car Id 
                isLoading: false
            }
        default:
            return {
                ...state
            }
    }

}

