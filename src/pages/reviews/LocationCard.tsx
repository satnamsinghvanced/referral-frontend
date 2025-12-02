import { Card, CardBody } from "@heroui/react";
import { FiWifi } from "react-icons/fi";
import { IoQrCodeOutline } from "react-icons/io5";
import { LuQrCode } from "react-icons/lu";
import { PiStarFill } from "react-icons/pi";

interface LocationProp {
  location: string;
  totalReviews: number;
  averageRating: number;
  nfcTaps: number;
  qrScans: number;
}
interface ReviewsLocationCardProps {
  locations: LocationProp[];
}
const ReviewsLocationCard = ({ locations }: ReviewsLocationCardProps) => {
  return (
    <>
      {locations.map((location, index) => (
        <Card
          key={index}
          className="border border-primary/15 bg-primary/2 p-4 rounded-lg"
          shadow="none"
        >
          <div className="flex justify-between">
            <h6 className="text-sm flex gap-2 items-center">
              {location.location}
            </h6>
            <div className="flex items-center gap-1">
              <PiStarFill className="inline h-4 w-4 text-yellow-400" />
              <div>{location.averageRating}</div>
            </div>
          </div>
          <CardBody className="text-xs flex flex-col gap-3 px-0 pt-5 pb-0">
            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col gap-0 items-center w-full">
                <p className="text-xl font-bold text-primary-600">
                  {location.totalReviews}
                </p>
                <p className="text-xs">Total Reviews</p>
              </div>
              <div className="text-sm flex flex-col gap-0 items-center w-full">
                <p className="text-xl font-bold text-orange-700">
                  {location.totalReviews}
                </p>
                <p className="text-xs">Digital Interactions</p>
              </div>
            </div>

            <ul className="flex flex-col gap-2 text-xs font-extralight mt-3">
              <li className="flex justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FiWifi className="text-sm text-primary-600" /> NFC Taps
                </div>
                <div className="font-semibold">{location.nfcTaps}</div>
              </li>
              <li className="flex justify-between gap-2">
                <div className="flex items-center gap-2">
                  <LuQrCode className="text-sm text-orange-700" /> QR Scans
                </div>
                <div className="font-semibold">{location.qrScans}</div>
              </li>
            </ul>
          </CardBody>
        </Card>
      ))}
    </>
  );
};

export default ReviewsLocationCard;
