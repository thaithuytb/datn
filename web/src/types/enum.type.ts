export const enum DeviceTypeEnum {
  FAN = "FAN",
  LAMP = "LAMP",
  NEBULIZER = "NEBULIZER",
  PUMP = "PUMP",
  LIGHTSENSOR = "LIGHTSENSOR",
  HUMISENSOR = "HUMISENSOR",
  TEMPAIRSENSOR = "TEMPAIRSENSOR",
}

export const convertDeviceType = {
  FAN: {
    name: "Quạt",
    value: "Bật",
  },
  LAMP: {
    name: "Đèn",
    value: "Bật",
  },
  NEBULIZER: {
    name: "Máy phun sương",
    value: "Tắt",
  },
  PUMP: {
    name: "Máy bơm",
    value: "Tắt",
  },
  LIGHTSENSOR: {
    name: "Cảm biến ánh sáng",
    value: 1247,
  },
  HUMISENSOR: {
    name: "Cảm biến độ ẩm đất",
    value: 70,
  },
  TEMPAIRSENSOR: {
    name: "Cảm biến nhiệt độ, độ ẩm",
    value: 30,
    otherValue: 70,
  },
};
