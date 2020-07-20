﻿// Variable Type
export interface InboundOrder {
    batch_id: string | null;
    pallet_id: string;
    order_pallet_count: number;
    expected_activation_time: Date | null; // as in service will run as NOW();
    sku_name: string;
    sku_code: string;
    status: string; //ENUM ?? 
    max_pallet_height: number;
    pallet_width: number;
    wms_receipt_link_id: number | null;
    wms_request_status_read: number | null;
    wms_storage_status_read: number | null;
}