import "./index.css";
import data_1 from "../../img/1.png";
import data_2 from "../../img/2.png";
import data_3 from "../../img/3.png";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

function Introduce() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const isAuthenticated = authContext?.authInformation.isAuthenticated;
  if (isAuthenticated) {
    console.log(isAuthenticated);
    navigate("/home");
  }
  return (
    <div className="introduce">
      <div>Mô phỏng không gian nhà kính phổ biến</div>
      <div className="introduce_img">
        <img alt="" src={data_1} />
        <div>
          Bố cục nhà kính sẽ chia cây trồng thành hàng dọc hướng từ Tây sang
          Đông, để dành một lối đi ở giữa rộng khoảng 2 mét dọc, các hàng cây
          được đặt cách nhau 80cm Bơm nước lấy nước hệ thống nước sạch đẩy nước
          qua bộ lọc nước rồi được trung chuyển qua các ống chính rẽ ra các ống
          nhánh tới từng cây đảm bảo tưới cây nhỏ giọt
        </div>
        <img alt="" src={data_2} />
        <div>
          Hệ thống đèn được lắp đặt treo dây từ trên cao với độ cao từ 2-2,5m để
          đảm bảo phát sáng cho toàn bộ cây trong khu vườn
        </div>
        <img alt="" src={data_3} />
        <div>
          Hệ thống quạt được lắp đặt lưu một chiều gió từ Bắc sang Nam để lưu
          thông gió giảm nhiệt độ và lưu thông khí CO2
        </div>
      </div>
    </div>
  );
}

export default Introduce;
