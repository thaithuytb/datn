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

    getNotification(dto: {
        type: string,
        seen?: boolean,
        page?: number,
        limit?: number
    }) {
        const url = `/notifications?type=${dto.type}&seen=${dto.seen}&page=${dto.page}&limit=${dto.limit}`
        return axiosClient.get(url);
    }

    updateNotificationsOnUsers(dto: {
        notificationId: number
    }) {
        const url = `/notifications/update`
        return axiosClient.patch(url, { dto: { ...dto } });
    }
}

export default NotificationApi;
