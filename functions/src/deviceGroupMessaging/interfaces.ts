export interface FCMServiceOptions{
    SenderId: string;
    LegaciServerKey: string
}

export interface CreateDeviceGroupOptions {
    notification_key_name: string;
    registrationIds: string[]
}

export interface CreateDeviceGroupResponse {
    notification_key: string;
}

export interface SendToDeviceGroupOptions {
    to: string;
    notification?: {
        title?: string;
        body?: string;
    };
    data?: any;
}

export interface SendToDeviceGroupResponse {
    success: number;
    failure: number;
    failed_registration_ids?: string[]
}

export interface AddDeviceToDeviceGroupOptions {
    notification_key_name: string;
    notification_key: string;
    registration_ids: string[]
}
