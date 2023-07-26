import { useContext, useEffect, useState } from "react";
import { GardenContext } from "../../contexts/GardenContext";
import { Select, SelectProps } from "antd";
export default function RoadMap() {
  const gardenContext = useContext(GardenContext);
  const gardens = gardenContext?.gardens;
  const [garden, setGarden] = useState<any>();

  useEffect(() => {
    gardenContext?.getGardens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      setGarden(null);
    }
  };

  console.log(garden);

  return (
    <div style={{ padding: "1rem" }}>
      <header>
        <label>Chọn vườn khu vuon: </label>
        <Select
          id="garden-select"
          style={{ width: 200 }}
          onChange={selectGarden}
          defaultValue={"Tất cả"}
          options={[
            {
              value: "",
              label: "Tất cả",
            },
            ...itemsOption,
          ]}
          placeholder={"Chọn khu vườn"}
        />
      </header>
      <br />
      {!garden ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {gardens &&
            gardens?.map((garden: any, index: number) => {
              return (
                <div key={index} style={{ width: "49%", marginBottom: "1rem" }}>
                  <h4 style={{ margin: 0 }}>{garden.name}</h4>
                  <iframe
                    title="test"
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7449.3702337228815!2d105.8398067!3d21.0052557!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135add3c46cb161%3A0x463734da30e16629!2zxJDhuqFpIGjhu41jIELDoWNoIGtob2EgSMOgIE7hu5lpIC0gSGFub2kgVW5pdmVyc2l0eSBvZiBTY2llbmNlIGFuZCBUZWNobm9sb2d5!5e0!3m2!1svi!2s!4v1690137215909!5m2!1svi!2s"
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              );
            })}
        </div>
      ) : (
        <div style={{ height: "70vh" }}>
          <h4 style={{ margin: 0 }}>{garden.garden.name}</h4>
          <iframe
            title="YouTube video player"
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7449.3702337228815!2d105.8398067!3d21.0052557!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135add3c46cb161%3A0x463734da30e16629!2zxJDhuqFpIGjhu41jIELDoWNoIGtob2EgSMOgIE7hu5lpIC0gSGFub2kgVW5pdmVyc2l0eSBvZiBTY2llbmNlIGFuZCBUZWNobm9sb2d5!5e0!3m2!1svi!2s!4v1690137215909!5m2!1svi!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
          ></iframe>
        </div>
      )}
    </div>
  );
}
