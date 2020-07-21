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
    readonly hasSpace: boolean;
}

export interface Pallet {
    readonly pallet_id: string;
    readonly car_reg: string | null; 
}

// Action name 
const REQUEST_STORE_STATE = 'REQUEST_STORE_STATE';
const RECEIVE_STORE_STATE = 'RECEIVE_STORE_STATE';
const STORING_CAR = 'STORING_CAR';
const STORED_CAR = 'STORED_CAR';
const RETRIEVING_CAR = 'RETRIEVING_CAR';
const RETRIEVED_CAR = 'RETRIEVED_CAR';
const UPDATE_SPACE_STATUS = 'UPDATE_SPACE_STATUS';

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

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
// Aggregate all actions together and to ensure will only receive these actions 
type StoreAction = RequestStoreStateAction | ReceiveStoreStateAction | StoringCarAction
    | StoredCarAction | RetrievingCarAction | RetrievedCarAction | UpdateSpaceStatusAction;

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
    // getting car reg in the param of storing car
    // dispatch storing car => axios call create inbound order => status:ACTIVE
    // axios call ifRegExist -> true -> dispatch stored car => udpate current state => -> axios call update status:COMPLETE
    //                         false -> dispatch carNotFound -> axios call update status: ERROR/DECLINED?
    storeCar: (carRegToStore: string): AppThunkAction<StoreAction> => (dispatch) => {
        dispatch({ type: STORING_CAR });
        // Create inbound Order 

        let b_id = Date.now() + carRegToStore;
        const inboundOrder: InboundOrder =
        {
            batch_id: b_id, // Created with Unix and carReg Number in backend
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
                                console.log("Car Reg valid");

                                // SOMEHOW DETECT WHEN DONE, Check Status if Complete or Error
                                inboundOrder.status = 'COMPLETE';
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
                                                        //Dispatch Stored car , need to some how get the actual pallet id
                                                        //dispatch({ type: STORED_CAR, pallet: pallet }) // but pallet here is incorrect

                                                        console.log("Car has been successfully stored.")
                                                        history.push('/');// Redirect to home
                                                    }
                                                    else {
                                                        console.log("Something went wrong while storing the car into car store");
                                                    }
                                                }).catch(error => {
                                                    console.log("storeCar caught an error while storing./Car reg is found in store.");
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
                                    })


                            } else {
                                // not exist then AXIOS CALL update status to ERROR?
                                alert("Car reg doesnt existed, please re-enter.");
                            }
                        }).catch(error => {
                            console.log("fetchCar in storeCar caught an error.");
                            //TODO:Create Dispatch type if error 
                        })
                }
                else {
                    console.log("Something went wrong in storeCar.");
                }
            }).catch(error => {
                console.log("storeCar caught an error./Failed to insert inbound order.");
            })
    },
    // dispatch retriving car => create outbound order => status:ACTIVE/ACCEPTED 
    // dispatch stored car => udpate current state 
    retrieveCar: (carRegToRetrieve: string): AppThunkAction<StoreAction> => (dispatch) => {
        //Create outbound Order 
        let b_id = Date.now() + carRegToRetrieve;
        const outBoundOrder: OutboundOrder = {
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
        }
        axios.post('api/outbound/insert-outboundOrder', outBoundOrder)
            .then(res => {
                if (res.status === 201 && res.data == true) {
                    console.log("Inserted outbound order.");

                    //Check if Car valid in store
                    axios.get('api/outbound/ifCarRegExist' + carRegToRetrieve)
                        .then(res => {
                            if (res.data === true) {
                                console.log("Car reg is found in the store.")

                                // SOMEHOW DETECT WHEN DONE,Check Status if Complete or Error
                                outBoundOrder.status = 'COMPLETE';
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
                                            console.log("Something went wrong while updating outbound order.");
                                        }
                                    }).catch(error => {
                                        console.log("retrieveCar does not receive any data/Car reg doesnt existed.");
                                    })
                            }
                        }).catch(error => {
                            console.log("Something went wrong while update status in outbound order.");
                        })
                }
            }).catch(error => {
                console.log("retrieveCar caught an error./Failed to insert outbound order.")
            })
    },
    //Check if there's space in the store
    checkIfStoreHasSpace: (): AppThunkAction<StoreAction> => (dispatch) => {
        axios.get('api/store/ifHasSpace')
            .then(res => {
                dispatch({ type: UPDATE_SPACE_STATUS, hasSpace: res.data })
            }).catch(error => {console.log("something went wrong while checking space in store.")})
    }
}

const unloadedStoreState: StoreState = {
    pallets: [], isLoading: false, hasSpace: false
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
                ...state.pallets.map(p => {
                    if (p.pallet_id === action.pallet.pallet_id) return action.pallet;
                    return p;
                }),
                isLoading: false
            }
        case RETRIEVING_CAR:
            return {
                ...state,
                isLoading:true
            }
        case RETRIEVED_CAR:
            return {
                ...state,
                ...state.pallets.map(p => {
                    if (p.pallet_id === action.pallet.pallet_id) return action.pallet;
                    return p;
                }),
                isLoading: false
            }
        case UPDATE_SPACE_STATUS:
            return {
                ...state,
                hasSpace: action.hasSpace
            }
        default:
            return {
                ...state
            }
    }

}

