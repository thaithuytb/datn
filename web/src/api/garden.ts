import axiosClient from "./axiosClient";

class GardenApi {
  getGardens() {
    //http://localhost:7000/sample?status=true&name=999999
    // const url = "/gardens";
    return axiosClient.get("sample?status=true&name=999999");
  }

  getGardenById(dto: { id: string }) {
    const url = `/gardens/${dto.id}`;
    return axiosClient.get(url);
  }
}
const gardenApi = new GardenApi();

export default gardenApi;
