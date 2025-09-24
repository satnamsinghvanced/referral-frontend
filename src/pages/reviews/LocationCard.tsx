import { Card, CardBody } from "@heroui/react";
import { FiWifi } from "react-icons/fi";
import { IoQrCodeOutline } from "react-icons/io5";
import RenderStars from "../../Utils/renderStars";

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
                <Card key={index} className="border border-primary/10 bg-primary/1 dark:bg-background/2 p-4 rounded-lg" shadow='none'>
                    <div className="flex justify-between">
                        <h6 className="text-sm flex gap-2 items-center">
                            {location.location}
                        </h6>
                        <div className="flex gap-1">
                            <RenderStars averageRating={location.averageRating} />
                            <div>{location.averageRating}</div>
                        </div>
                    </div>
                    <CardBody className="text-xs flex flex-col gap-5">
                        <div className="flex justify-between items-center w-full">
                            <div className="text-sm flex flex-col gap-0 items-center w-full">
                                <p className="text-xl font-bold text-primary-600">{location.totalReviews}</p>
                                <p>Total Reviews</p>
                            </div>
                            <div className="text-sm flex flex-col gap-0 items-center w-full">
                                <p className="text-xl font-bold text-orange-700">{location.totalReviews}</p>
                                <p>Digital Interactions</p>
                            </div>
                        </div>


                        <ul className="flex flex-col gap-2 text-sm font-extralight mt-3">
                            <li className="flex justify-between gap-2">
                                <div className="flex items-center gap-2"><FiWifi className="text-primary-600" /> NFC Taps</div>
                                <div className="font-semibold">{location.nfcTaps}</div>
                            </li>
                            <li className="flex justify-between gap-2">
                                <div className="flex items-center gap-2"><IoQrCodeOutline className="text-orange-700" /> QR Scans</div>
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
