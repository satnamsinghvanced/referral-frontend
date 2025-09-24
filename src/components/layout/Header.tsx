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
  return (
    <Navbar
      height={63}
      isBordered
      classNames={{
        base: "border-text/10 dark:border-background/30 bg-background dark:bg-text",
        wrapper: "max-w-none px-4 md:px-6",
      }}
    >
      <NavbarContent justify="start" className="items-center gap-3">
        <div className="lg:hidden">
          <button onClick={hamburgerMenuClick} className="flex cursor-pointer text-xl text-text ">
            <HiOutlineMenuAlt1 />
          </button>
        </div>
        <NavbarContent className="hidden sm:flex gap-6">
          {/* {HEADER_LINKS.map((navItem) => (
            <NavbarItem key={navItem.link}>
              <Link
                to={navItem.link}
                className="text-sm px-3.5 py-1.5 text-foreground hover:bg-text/4 rounded-md"
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
                "min-h-8 font-normal text-default-500 shadow-none bg-text/4 group-data-[focus=true]:border-default-400 text-text dark:bg-background/10",
              // "min-h-9 font-normal text-default-500 shadow-none border-small bg-text-10 group-data-[focus=true]:border-default-400 text-text",
            }}
            placeholder="Search referrals..."
            startContent={<IoSearch size={18} className="text-text/50" />}
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
                "min-h-9 font-normal text-default-500 shadow-none border-small bg-text-10 group-data-[focus=true]:border-default-400 text-text",
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
                <p>Dr. Smith</p>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">zoey@example.com</p>
              </DropdownItem>
              <DropdownItem key="settings">My Settings</DropdownItem>
              <DropdownItem key="team_settings">Team Settings</DropdownItem>
              <DropdownItem key="analytics">Analytics</DropdownItem>
              <DropdownItem key="system">System</DropdownItem>
              <DropdownItem key="configurations">Configurations</DropdownItem>
              <DropdownItem key="help_and_feedback">
                Help & Feedback
              </DropdownItem>
              <DropdownItem key="logout" color="danger">
                Log Out
              </DropdownItem>
              <DropdownItem key="theme">Theme</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </NavbarContent>
    </Navbar>
  );
}
