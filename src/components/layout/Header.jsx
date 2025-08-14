import {
  Navbar,
  NavbarContent,
  NavbarItem,
  Link,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  Input,
} from "@heroui/react";
import { IoSearch } from "react-icons/io5";

const HEADER_LINKS = [
  {
    label: "Home",
    link: "/",
  },
  {
    label: "Reports",
    link: "/reports",
  },
  {
    label: "Social Media",
    link: "/social",
  },
  {
    label: "Calender",
    link: "/calender",
  },
  {
    label: "Budget",
    link: "/budget",
  },
];

export default function Header() {
  return (
    <Navbar
      isBordered
      classNames={{ base: "border-gray-200", wrapper: "max-w-none" }}
    >
      <NavbarContent justify="start">
        <NavbarContent className="hidden sm:flex gap-6">
          {HEADER_LINKS.map((navItem) => {
            return (
              <NavbarItem key={navItem.link}>
                <Link
                  color="foreground"
                  href={navItem.link}
                  className="text-sm px-3.5 py-1.5"
                >
                  {navItem.label}
                </Link>
              </NavbarItem>
            );
          })}
        </NavbarContent>
      </NavbarContent>

      <NavbarContent as="div" className="items-center gap-5" justify="end">
        <Input
          classNames={{
            base: "max-w-full sm:max-w-[15rem]",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper:
              "min-h-9 font-normal text-default-500 shadow-none border-small bg-gray-50 group-data-[focus=true]:border-default-400",
          }}
          placeholder="Search referrals..."
          size="sm"
          startContent={<IoSearch size={18} />}
          type="search"
          variant="bordered"
        />
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              as="button"
              className="transition-transform cursor-pointer"
              color="primary"
              name="Jason Hughes"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
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
            <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
            <DropdownItem key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}
