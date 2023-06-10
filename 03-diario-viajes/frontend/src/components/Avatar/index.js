import defaultAvatar from "../../assets/images/defaultAvatar.jpg";

// Pinta el avatar del usuario o, si no tiene, el avatar por defecto
const Avatar = ({ avatar, username }) => {
  return (
    <img
      src={avatar ? `http://localhost:4000/${avatar}` : defaultAvatar}
      alt={`${username} avatar`}
    />
  );
};

export default Avatar;
