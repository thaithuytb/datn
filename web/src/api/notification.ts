import queryString from "query-string";
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
        return axiosClient.get(url) as unknown as ApiResponse;
    }

    getNotification(dto: {
        type?: string,
        seen?: boolean,
        page?: number,
        limit?: number
    }) {
        const url = `/notifications?${queryString.stringify({ ...dto})}`
        return axiosClient.get(url)  as unknown as ApiResponse;
    }

    updateNotificationsOnUsers(dto: {
        notificationId: number
    }) {
        const url = `/notifications/update`
        return axiosClient.patch(url, { dto: { ...dto } })  as unknown as ApiResponse;
    }
}

export default NotificationApi;
