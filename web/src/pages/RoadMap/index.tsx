export default function RoadMap() {
  return (
    <div style={{ padding: 20 }}>
      <iframe
        title="test"
        src="https://goo.gl/maps/WTV8rxztaD6sHkwMA"
        width="600"
        height="450"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}