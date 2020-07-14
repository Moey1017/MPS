import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import { history } from '../index';
import axios from 'axios';

// Variable Type
export interface InboundOrder {
    batch_id: string;
    pallet_id: string;
    order_pallet_couunt: number;
    expected_activation_time: string; // as in service will run as NOW();
    sku_name: string;
    sku_code: string;
    status: string; //ENUM ?? 
    max_pallet_height: number;
    pallet_width: number;
    wms_receipt_link_id: number;
    wms_request_status_read: number;
    wms_storage_status_read: number;
}