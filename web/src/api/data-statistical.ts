import axiosClient from "./axiosClient";

export interface ApiDataStatistical {
    success: boolean;
    data: any;
    message?: string; //Error
    statusCode?: number; //Error
}

class DataStatisticalApi {
    getDataStatisticalByDate(dto: { time?: string }) {
        let url = `/data-statistical`
        if(dto.time) {
            url = `/data-statistical?time=${dto.time}`
        }
        return axiosClient.get(url) as unknown as ApiDataStatistical;
    }
}

export default DataStatisticalApi;
