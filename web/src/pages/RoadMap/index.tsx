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
                  src="https://goo.gl/maps/h8XCzzBn8V5sUPpn9"
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
            src="https://www.youtube.com/embed/MQdmTqPpgg8"
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