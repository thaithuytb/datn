import axiosClient from "./axiosClient";

export interface ApiResponse {
    success: boolean;
    data: any;
    message?: string; //Error
    statusCode?: number; //Error
}
// http://localhost:7000/api/v1/notifications/count-unread
class NotificationApi {
    countNotifile() {
        const url = "/notifications/count-unread";
        return axiosClient.get(url);
    }
}

export default NotificationApi;
