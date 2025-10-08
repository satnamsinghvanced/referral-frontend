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
import { IoSearch } from "react-icons/io5";
import Notification from "../common/Notification";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import ThemeToggle from "../common/ThemeToggle";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { logout } from "../../store/authSlice";
import { Link, useNavigate } from "react-router";
import { useTypedSelector } from "../../hooks/useTypedSelector";

// const HEADER_LINKS = [
//   {
//     label: "Home",
//     link: "/",
//   },
//   {
//     label: "Reports",
//     link: "/reports",
//   },
//   {
//     label: "Social Media",
//     link: "/social",
//   },
//   {
//     label: "Calender",
//     link: "/calender",
//   },
//   {
//     label: "Budget",
//     link: "/budget",
//   },
// ];

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
      height={63}
      isBordered
      classNames={{
        base: "border-foreground/10  bg-background ",
        wrapper: "max-w-none px-4 md:px-6",
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
          {/* {HEADER_LINKS.map((navItem) => (
            <NavbarItem key={navItem.link}>
              <Link
                to={navItem.link}
                className="text-sm px-3.5 py-1.5 text-foreground hover:bg-foreground/4 rounded-md"
              >
                {navItem.label}
              </Link>
            </NavbarItem>
          ))} */}
          <Input
            size="sm"
            classNames={{
              base: "max-w-full sm:max-w-[15rem]",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper:
                "min-h-8 font-normal text-default-500 shadow-none bg-foreground/4 group-data-[focus=true]:border-default-400 text-foreground /10",
              // "min-h-9 font-normal text-default-500 shadow-none border-small bg-foreground-10 group-data-[focus=true]:border-default-400 text-foreground",
            }}
            placeholder="Search referrals..."
            startContent={<IoSearch size={18} className="text-foreground/50" />}
            type="search"
            variant="flat"
          />
        </NavbarContent>
      </NavbarContent>

      <NavbarContent as="div" className="items-center gap-4" justify="end">
        <div className="flex gap-3">
          {/* <Input
            size='sm'
            classNames={{
              base: "max-w-full sm:max-w-[15rem]",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper:
                "min-h-9 font-normal text-default-500 shadow-none border-small bg-foreground-10 group-data-[focus=true]:border-default-400 text-foreground",
            }}
            placeholder="Search referrals..."
            startContent={<IoSearch size={18} />}
            type="search"
            variant="bordered"
          /> */}

          {/* HTTP Error Debug Panel */}
          {/* <HttpErrorDebugPanel /> */}
        </div>

        {/* admin access only  */}
        {/* <SuperAdminLogin /> */}

        <div className="flex gap-3 justify-center items-center">
          {/* notification */}
          <Notification />
          {/* <ThemeToggle /> */}
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              {/* <Avatar
                as="button"
                className="transition-transform cursor-pointer"
                color="primary"
                name="Jason Hughes"
                size="sm"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              /> */}
              <Button
                size="sm"
                className="text-sm flex justify-center items-center gap-2 !cursor-pointer bg-transparent hover:bg-orange-200 hover:text-orange-600"
              >
                <FiUser fontSize={16} />
                <p>{user?.firstName}</p>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2" href="/referral-retrieve/settings">
                {/* <Link to="/settings"> */}
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">{user?.email}</p>
                {/* </Link> */}
              </DropdownItem>
              <DropdownItem key="general">
                <Link to="/settings/general">General</Link>
              </DropdownItem>
              <DropdownItem key="locations">
                <Link to="/settings/locations">Locations</Link>
              </DropdownItem>
              <DropdownItem key="team">
                <Link to="/settings/team">Team Settings</Link>
              </DropdownItem>
              <DropdownItem key="billing">
                <Link to="/settings/billing">Billing</Link>
              </DropdownItem>
              <DropdownItem key="logout" color="danger" onPress={handleLogout}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </NavbarContent>
    </Navbar>
  );
}
