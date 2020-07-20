// Variable Type
export interface OutboundOrder {
    batch_id: string | null;
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