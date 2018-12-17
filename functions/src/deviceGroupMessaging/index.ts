import * as request from 'request-promise-native'
import {
    CreateDeviceGroupOptions,
    CreateDeviceGroupResponse,
    SendToDeviceGroupOptions,
    SendToDeviceGroupResponse,
    AddDeviceToDeviceGroupOptions,
    FCMServiceOptions
} from './interfaces'

export class FcmService {

    public static Instance: FcmService;
    public static initializeApp(options: FCMServiceOptions){
        this.Instance = new FcmService(options.SenderId, options.LegaciServerKey)
    }

    private constructor(
        private SenderId: string,
        private LegaciServerKey: string
    ){}

    public createDeviceGroup(options: CreateDeviceGroupOptions) : Promise<CreateDeviceGroupResponse | null> {
        if(options.registrationIds.length === 0){
            console.error("je potřeba alespoň jedno registrační ID!");
            return null;
        }

        const fcmRequest = {
            method: 'POST',
            url: 'https://fcm.googleapis.com/fcm/notification',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `key=${this.LegaciServerKey}`,
                'project_id' : this.SenderId
            },
            body: {
                "operation": "create",
                "notification_key_name": options.notification_key_name,
                "registration_ids": options.registrationIds
            },
            json: true
        }

        return request(fcmRequest);
    }

    public addToDeviceGroup(options: AddDeviceToDeviceGroupOptions) : Promise<CreateDeviceGroupResponse> {
        const fcmRequest = {
            method: 'POST',
            url: 'https://fcm.googleapis.com/fcm/notification',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `key=${this.LegaciServerKey}`,
                'project_id' : this.SenderId
            },
            body: {
                "operation": "add",
                "notification_key_name": options.notification_key_name,
                "notification_key": options.notification_key,
                "registration_ids": options.registration_ids
            },
            json: true
        }
        return request(fcmRequest);
    }

    public sendMessageToDeviceGroup(options: SendToDeviceGroupOptions) : Promise<SendToDeviceGroupResponse>{
        const fcmRequest = {
            method: 'POST',
            url: 'https://fcm.googleapis.com/fcm/send',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `key=${this.LegaciServerKey}`
            },
            body: options,
            json: true
        }
        return request(fcmRequest);
    }
}
