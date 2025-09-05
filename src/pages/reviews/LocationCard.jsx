import { Button, Card, CardBody, Divider } from "@heroui/react";
import { CiShare1 } from "react-icons/ci";
import { FaQrcode } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";
import RenderStars from "../../Utils/renderStars";

const ReviewsLocationCard = ({ locations }) => {
    return (
        <>
            {locations.map((location, index) => (
                <Card key={index} className="border border-text/10 p-4" shadow='none'>
                    <h6 className="text-sm flex gap-2 items-center">
                        <IoLocationOutline className="text-sky-600 w-4 h-4" />
                        <span>{location.location}</span>
                    </h6>
                    <CardBody className="text-xs flex flex-col gap-5">
                        <ul className="flex flex-col gap-5 font-extralight mt-3">
                            <li className="flex justify-between gap-2">
                                <div className="!font-extralight">Total Reviews</div>
                                <div>{location.totalReviews}</div>
                            </li>
                            <li className="flex justify-between gap-2">
                                <div>Average Rating</div>
                                <div className="flex gap-1">
                                    <div>{location.averageRating}</div>
                                    <RenderStars averageRating={location.averageRating} />
                                </div>
                            </li>
                            <li className="flex justify-between gap-2">
                                <div>This Month</div>
                                <div className="text-green-700 bg-green-100 rounded-md py-0.5 px-1">+{location.reviewsThisMonth} reviews</div>
                            </li>
                        </ul>
                        <Divider className="my-4eqw" />
                        <ul className="flex flex-col gap-3">
                            <li>{location.address}</li>
                            <li>{location.phone}</li>
                        </ul>
                        <div className="flex gap-2 w-full">
                            <Button size="sm" className="bg-text text-background w-full">
                                <CiShare1 className="font-bold" />    View On Google
                            </Button>
                            <Button size="sm" className="border border-text/30 bg-transparent w-full">
                                <FaQrcode />    QR Code
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            ))}
        </>
    );
};

export default ReviewsLocationCard;
