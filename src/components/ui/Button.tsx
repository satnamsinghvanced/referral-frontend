import {
  Button as HeroButton,
  ButtonProps as HeroButtonPropsOriginal,
} from "@heroui/react";
import { RiLoaderFill } from "react-icons/ri";

// Extend HeroButton props but keep everything optional for your wrapper
interface ButtonProps
  extends Omit<
    HeroButtonPropsOriginal,
    "variant" | "size" | "color" | "radius"
  > {
  variant?: HeroButtonPropsOriginal["variant"];
  color?: HeroButtonPropsOriginal["color"];
  size?: HeroButtonPropsOriginal["size"];
  radius?: HeroButtonPropsOriginal["radius"];
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "solid",
  color = "primary",
  size = "sm",
  radius = "sm",
  startContent,
  endContent,
  spinner = <RiLoaderFill className="animate-spin" />,
  spinnerPlacement = "start",
  fullWidth = false,
  isIconOnly = false,
  isDisabled = false,
  isLoading = false,
  disableRipple = false,
  disableAnimation = false,
  onPress,
  onPressStart,
  onPressEnd,
  onPressChange,
  onPressUp,
  onKeyDown,
  onKeyUp,
  className = "",
  ...rest
}) => {
  return (
    <HeroButton
      {...rest}
      onPress={onPress || (() => {})}
      onPressStart={onPressStart || (() => {})}
      onPressEnd={onPressEnd || (() => {})}
      onPressChange={onPressChange || (() => {})}
      onPressUp={onPressUp || (() => {})}
      // other props
    >
      {children}
    </HeroButton>
  );
};

export default Button;
