import {
  Button,
  Card,
  CardBody,
  CardHeader
} from "@heroui/react";
import React from "react";
import { BiEdit } from "react-icons/bi";
import { FiPlus } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";
import { RiDeleteBinLine } from "react-icons/ri";

interface Location {
  name: string;
  address: string;
  phone: string;
  isPrimary?: boolean;
}

const Locations: React.FC = () => {
  const locations: Location[] = [
    {
      name: "Tulsa",
      address: "123 Main St, Tulsa, OK 74101",
      phone: "(918) 555-0101",
      isPrimary: true,
    },
    {
      name: "Jenks",
      address: "456 Oak Ave, Jenks, OK 74037",
      phone: "(918) 555-0102",
    },
    {
      name: "Bixby",
      address: "789 Elm St, Bixby, OK 74008",
      phone: "(918) 555-0103",
    },
  ];

  const handleEdit = (name: string) => {
    console.log("Edit", name);
  };

  const handleDelete = (name: string) => {
    console.log("Delete", name);
  };

  return (
    <Card className="rounded-xl bg-white text-gray-900 shadow-none border border-text/10">
      <CardHeader className="flex items-center gap-3 px-5 pt-5 pb-0">
        <GrLocation className="h-5 w-5 text-gray-700" />
        <p className="text-base">Practice Locations</p>
      </CardHeader>

      <CardBody className="p-5 space-y-3">
        {/* Location List */}
        {locations.map((location, index) => (
          <div
            key={index}
            className="p-3 border border-text/10 rounded-lg flex items-start justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-medium text-sm">{location.name}</h4>
                {location.isPrimary && (
                  <span className="inline-flex items-center justify-center rounded-md px-2 py-0.5 text-[11px] font-medium w-fit whitespace-nowrap shrink-0 bg-blue-100 text-blue-800">
                    Primary
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 mb-1">{location.address}</p>
              <p className="text-xs text-gray-600">{location.phone}</p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                isIconOnly
                size="sm"
                variant="bordered"
                className="border-text/10 border-small"
                onClick={() => handleEdit(location.name)}
              >
                <BiEdit className="size-4" />
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="bordered"
                className="border-text/10 text-red-600 border-small"
                onClick={() => handleDelete(location.name)}
              >
                <RiDeleteBinLine className="size-4" />
              </Button>
            </div>
          </div>
        ))}

        {/* Add Location */}
        <Button
          variant="bordered"
          size="sm"
          className="w-full flex items-center justify-center gap-2 border-text/10 border-small font-medium"
        >
          <FiPlus className="h-4 w-4" />
          Add Location
        </Button>
      </CardBody>
    </Card>
  );
};

export default Locations;
