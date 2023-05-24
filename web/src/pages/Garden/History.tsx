import { Image } from "antd";
import { useParams } from "react-router-dom";

export default function History() {
  const { id } = useParams();
  // console.log(id)
  return (
    <div>
      <div className="info_DeviceDetail">
        <Image
          width={200}
          src="https://thietbibenthanh.com/uploads/images/2019/08/1566981169-single_pcat23-bientan1.jpg"
        />
        <div>
          <p>tên</p>
          <p>trạng thái hiện tại</p>
          <p>
            <button>click</button>
          </p>
        </div>
      </div>
      <div className="history_DeviceDetail">
        <p>Lịch sử</p>
      </div>
    </div>
  );
}
