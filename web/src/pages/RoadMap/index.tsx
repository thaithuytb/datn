import { useContext, useEffect, useState } from "react";
import { GardenContext } from "../../contexts/GardenContext";
import { Select, SelectProps } from "antd";
export default function RoadMap() {
  const gardenContext = useContext(GardenContext);
  const gardens = gardenContext?.gardens
  const [garden, setGarden] = useState<any>();

  useEffect(() => {
    gardenContext?.getGardens()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const itemsOption: SelectProps["options"] =
    gardens?.map((garden) => ({
      id: garden.id,
      value: garden.name,
      label: garden.name,
    })) || [];

  const selectGarden = async (value: any, item: any) => {
    const garden = gardens?.find((garden) => garden.id === item.id);
    if (garden) {
      setGarden({ ...item, garden: garden });
    } else {
      setGarden(null)
    }
  };

  console.log(garden)

  return (
    <div style={{ padding: '1rem', }}>
      <header>
        <label>Chọn vườn khu vuon: </label>
        <Select
          id="garden-select"
          style={{ width: 200 }}
          onChange={selectGarden}
          defaultValue={"Tat ca"}
          options={[
            {
              value: "",
              label: "Tat ca"
            },
            ...itemsOption
          ]}
          placeholder={"Chọn khu vườn"}
        />
      </header>
      <br />
      {!garden ?
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: 'space-between'
        }}>
          {gardens && gardens?.map((garden: any, index: number) => {
            return (
              <div key={index} style={{ width: '49%', marginBottom: "1rem" }}>
                <h4 style={{ margin: 0 }}>{garden.name}</h4>
                <iframe
                  title="test"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119556.18319883458!2d106.530424!3d20.54183155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314a09dbf440f1f9%3A0x86f86edbef4ed003!2zVGjDoWkgVGjhu6d5LCBUaGFpIEJpbmg!5e0!3m2!1sen!2s!4v1688999854789!5m2!1sen!2s"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            )
          })}
        </div>
        :
        <div style={{ height: "70vh" }}>
          <h4 style={{ margin: 0 }}>{garden.garden.name}</h4>
          <iframe
            title="YouTube video player"
            src="https://www.youtube.com/embed/OTdtjuXNyWM"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
          >
          </iframe>
        </div>
      }
    </div>
  );
}