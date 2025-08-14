import { Avatar } from "@heroui/react"; // HeroUI Avatar component

const Profile = ({ className, imgClass, user }) => {
  let display =
    user?.lastName?.length > 0
      ? `${user?.firstName?.slice(0, 1)}${user?.lastName?.slice(0, 1)}`
      : user?.firstName?.slice(0, 2);

  const avatarUrl =
    user?.avatar && user?.avatar !== ""
      ? `${import.meta.env.VITE_API_URL}${user.avatar}`
      : null;

  return (
    <Avatar
      src={avatarUrl || undefined}
      name={display?.toUpperCase()}
      size="sm"
      className={className}
      classNames={{
        img: imgClass,
      }}
    />
  );
};

Profile.defaultProps = {
  className: "",
  imgClass: "object-cover",
};

export default Profile;
