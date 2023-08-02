import "./index.css";

interface PropsAvatar {
  width?: string;
  url?: string;
}

const Avatar: React.FC<PropsAvatar> = ({ url, width }) => {
  const avatarUrl =
    url ||
    "https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745";

  const avatarWidth = width || "50px";
  return (
    <div
      className="avatar_circle"
      style={{ width: avatarWidth, height: avatarWidth }}
    >
      <img src={avatarUrl} alt="" />
    </div>
  );
};

export default Avatar;
