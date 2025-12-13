import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Navbar,
  NavbarContent,
} from "@heroui/react";
import { FiUser } from "react-icons/fi";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { AppDispatch } from "../../store";
import { logout } from "../../store/authSlice";
import Notification from "../common/Notification";
import NotificationPopover from "../ui/NotificationsPopover";

export default function Header({
  hamburgerMenuClick,
}: {
  hamburgerMenuClick: () => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { user } = useTypedSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/signin");
  };
  return (
    <Navbar
      isBordered
      classNames={{
        base: "border-foreground/10 bg-background h-[58px] md:h-[64px]",
        wrapper: "max-w-none px-4 md:px-6 h-auto",
      }}
    >
      <NavbarContent justify="start" className="items-center gap-3">
        <div className="lg:hidden">
          <button
            onClick={hamburgerMenuClick}
            className="flex cursor-pointer text-xl text-foreground "
          >
            <HiOutlineMenuAlt1 />
          </button>
        </div>
        <NavbarContent className="hidden sm:flex gap-6">
          <Input
            size="sm"
            classNames={{
              base: "max-w-full sm:max-w-[15rem]",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper:
                "min-h-8 font-normal text-default-500 shadow-none bg-foreground/4 group-data-[focus=true]:border-default-400 text-foreground /10",
            }}
            placeholder="Search referrals..."
            startContent={<IoSearch size={18} className="text-foreground/50" />}
            type="search"
            variant="flat"
          />
        </NavbarContent>
      </NavbarContent>

      <NavbarContent as="div" className="items-center gap-4" justify="end">
        <div className="flex gap-3 justify-center items-center">
          <NotificationPopover />
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button
                size="sm"
                radius="sm"
                variant="ghost"
                className="text-sm flex justify-center items-center gap-2 border-none"
                startContent={<FiUser fontSize={16} />}
              >
                <p>{user?.firstName}</p>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem
                key="profile"
                className="h-14 gap-2"
                onPress={() => navigate("/settings")}
                textValue={`Signed in as ${user?.email}`}
              >
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{user?.email}</p>
              </DropdownItem>
              <DropdownItem
                key="general"
                onPress={() => navigate("/settings/general")}
                textValue="General"
              >
                General
              </DropdownItem>
              <DropdownItem
                key="locations"
                onPress={() => navigate("/settings/locations")}
                textValue="Locations"
              >
                Locations
              </DropdownItem>
              <DropdownItem
                key="team"
                onPress={() => navigate("/settings/team")}
                textValue="Team Settings"
              >
                Team Settings
              </DropdownItem>
              <DropdownItem
                key="billing"
                onPress={() => navigate("/settings/billing")}
                textValue="Billing"
              >
                Billing
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                textValue="Log Out"
                onPress={handleLogout}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </NavbarContent>
    </Navbar>
  );
}
