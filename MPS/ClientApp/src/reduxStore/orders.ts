import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import { history } from '../index';
import axios from 'axios';

export interface OrdersState {
    inbound_orders: InboundOrder[];
    outbound_orders: OutboundOrder[];
}

// Variable Type
export interface InboundOrder {
    batch_id: string;
    pallet_id: string;
    order_pallet_count: number;
    expected_activation_time: Date | null; // as in service will run as NOW();
    sku_name: string;
    sku_code: string;
    status: string; //ENUM??
    max_pallet_height: number;
    pallet_width: number;
    wms_receipt_link_id: number | null;
    wms_request_status_read: number | null;
    wms_storage_status_read: number | null;
}
// Variable Type
export interface OutboundOrder {
    batch_id: string;
    pallet_id: string;
    order_pallet_count: number;
    expected_activation_time: Date | null; // as in service will run as NOW();
    status: string;
    index: number;
    source: string | null;
    wms_link_id: string | null;
    wms_request_status_read: string | null;
    wms_output_status_read: string | null;
    automated_activation_time: Date | null;
    target: number;
}

//Action names 
const GET_INBOUNDS = 'GET_INBOUNDS';
const GET_OUTBOUNDS = 'GET_OUTBOUNDS';

interface GetInboundActions {
    type: typeof GET_INBOUNDS;
    inbound_orders: InboundOrder[];
}

interface GetOutboundActions {
    type: typeof GET_OUTBOUNDS;
    outbound_orders: OutboundOrder[];
}

type OrdersAction = GetInboundActions | GetOutboundActions;

export const actionCreators = {
    loadInboundOrders: (): AppThunkAction<OrdersAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState) {
            axios.get('api/inbound/get-inboundOrders')
                .then(res => {
                    if (res.data) {
                        dispatch({ type: GET_INBOUNDS, inbound_orders: res.data })
                    } else {
                        console.log("loadInboundOrders did not receive any data.");
                    }
                }).catch(error => {
                    console.log("loadInboundOrders caught an error.");
                    console.log(error);
                    //TODO:Create Dispatch type if error 
                })
        }
    },
    loadOutboundOrders: (): AppThunkAction<OrdersAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.cars) {
            axios.get('api/outbound/get-outboundOrders')
                .then(res => {
                    if (res.data) {
                        dispatch({ type: GET_OUTBOUNDS, outbound_orders: res.data })
                    } else {
                        console.log("loadOutboundOrders did not receive any data.");
                    }
                }).catch(error => {
                    console.log("loadOutboundOrders caught an error.");
                    console.log(error);
                    //TODO:Create Dispatch type if error 
                })
        }
    }
}

// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
const unloadedOrdersState: OrdersState = {
    inbound_orders: [], outbound_orders: []
};

export const reducer: Reducer<OrdersState> = (state: OrdersState | undefined, incomingAction: Action): OrdersState => {
    if (state === undefined) {
        return unloadedOrdersState;
    }

    const action = incomingAction as OrdersAction; // to ensure will only receive these actions 
    switch (action.type) {
        case GET_INBOUNDS:
            return {
                ...state,
                inbound_orders: action.inbound_orders
            };
        case GET_OUTBOUNDS:
            return {
                ...state,
                outbound_orders: action.outbound_orders
            };
        default:
            return {
                ...state
            }
    }
}