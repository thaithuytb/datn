import "./index.css";
import { useParams } from "react-router-dom";
import { ColumnsType } from "antd/es/table";
import { useContext, useEffect } from "react";
import GardenDevicesTable from "../../components/GardenDevicesTable";
import { GardenContext } from "../../contexts/GardenContext";
import { Link } from "react-router-dom";

export default function Garden() {
  const gardenContext = useContext(GardenContext);
  const { gardenId } = useParams();

  const gardenDetail = gardenContext?.gardenDetail;

  return (
    <div className="garden">
      {gardenDetail && (
        <>
          <header className="garden_header">
            <h3>Thông tin khu vườn</h3>
            <p>
              <span>Diện tích</span>
              <span>{gardenDetail.landArea}m²</span>
            </p>
            <p>
              <span>Chiều cao</span>
              <span>{gardenDetail.hight}m</span>
            </p>
            <p>
              <span>Địa chỉ</span>
              <span>{gardenDetail.address} </span>
            </p>
            <p>
              <span>Số thiết bị</span>
              <span>{gardenDetail.devices.length} </span>
            </p>
            <p>
              <span>Số người tham gia</span>
              <span>{gardenDetail.users.length} </span>
            </p>
          </header>
        </>
      )}
    </div>
  );
}
