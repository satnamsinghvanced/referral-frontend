import {
    Button as HeroButton
} from "@heroui/react";
import { ButtonColor, ButtonRadius, ButtonSize, ButtonType, ButtonVariant, SpinnerPlacement } from "../../types/types";

interface HeroButtonProps {
    children: React.ReactNode;
    variant?: ButtonVariant;
    variantDefault?: 'solid';
    color?: ButtonColor;
    colorDefault?: 'default';
    size?: ButtonSize;
    sizeDefault?: 'md';
    radius?: ButtonRadius;
    radiusDefault?: 'xl';
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    spinner?: React.ReactNode;
    spinnerPlacement?: SpinnerPlacement;
    fullWidth?: boolean;
    isIconOnly?: boolean;
    isDisabled?: boolean;
    isLoading?: boolean;
    disableRipple?: boolean;
    disableAnimation?: boolean;
    onPress?: any;
    onPressStart?: any;
    onPressEnd?: any;
    onPressChange?: any;
    onPressUp?: any;
    onKeyDown?: any;
    onKeyUp?: any;
    className?: any
    buttonType?: ButtonType
}
const Button = ({
    children,
    startContent,
    endContent,
    onPress,
    variant = 'solid',
    color = 'default',
    size = 'md',
    radius = 'sm',
    spinner,
    spinnerPlacement = 'start',
    fullWidth = false,
    isIconOnly = false,
    isDisabled = false,
    isLoading = false,
    disableRipple = false,
    disableAnimation = false,
    onPressStart,
    onPressEnd,
    onPressChange,
    onPressUp,
    onKeyDown,
    onKeyUp,
    className = '',
    buttonType = 'primary',
}: HeroButtonProps) => {

    let buttonClassName = className;

    if (buttonType === 'primary') {
        buttonClassName = ' bg-primary text-background';
    } else if (buttonType === 'secondary') {
        buttonClassName = ' border border-foreground/30 bg-transparent';
    } else if (buttonType === 'success') {
        buttonClassName = ' success-class';
    } else if (buttonType === 'warning') {
        buttonClassName = ' warning-class';
    } else if (buttonType === 'danger') {
        buttonClassName = ' danger-class';
    } else if (buttonType === 'info') {
        buttonClassName = ' info-class';
    } else if (buttonType === 'custom') {
        buttonClassName = ' custom-class';
    }

    return (
        // 'custom' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
        <HeroButton
            className={
                `${buttonClassName} ${className}`
            }
            variant={variant}
            color={color}
            size={size}
            radius={radius}
            startContent={startContent}
            endContent={endContent}
            spinner={spinner}
            spinnerPlacement={spinnerPlacement}
            fullWidth={fullWidth}
            isIconOnly={isIconOnly}
            isDisabled={isDisabled}
            isLoading={isLoading}
            disableRipple={disableRipple}
            disableAnimation={disableAnimation}
            onPress={onPress}
            onPressStart={onPressStart}
            onPressEnd={onPressEnd}
            onPressChange={onPressChange}
            onPressUp={onPressUp}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
        >
            {!isIconOnly && children}
        </HeroButton>
    );
};

export default Button;
