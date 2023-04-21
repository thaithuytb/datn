import axiosClient from "./axiosClient";

class GardenApi {
  getGardens() {
    const url = "/gardens";
    return axiosClient.get(url);
  }

  getGardenById(dto: {
    id: string
  }) {
    const url = `/gardens/${dto.id}`;
    return axiosClient.get(url);
  }
}
const gardenApi = new GardenApi();

export default gardenApi;