import { Avatar } from "@heroui/react"; // HeroUI Avatar component

interface ProfileProps {
  className?: string;
  imgClass?: string;
  user: {
    firstName: string;
    lastName?: string;
    avatar?: string;
  } | null;
}

const Profile = ({ className, imgClass, user }: ProfileProps) => {
  let display =
    (user?.lastName?.length || 0) > 0
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
