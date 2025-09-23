import { Card, CardBody } from '@heroui/react';
import { CiLocationOn } from 'react-icons/ci';
import RenderStars from '../../Utils/renderStars';

const Overview = () => {

    const locationsData = [
        {
            city: "Tulsa",
            averageRating: 4.8,
            reviewsCount: 287,
            growthThisMonth: 23,
        },
        {
            city: "Dallas",
            averageRating: 4.5,
            reviewsCount: 150,
            growthThisMonth: 10,
        },
        {
            city: "Austin",
            averageRating: 3.9,
            reviewsCount: 200,
            growthThisMonth: 18,
        },
        // Add more locations as needed
    ];


    return (
        <div className="flex flex-col gap-4">
            <div>
                <Card className="border border-text/10 p-4" shadow='none'>
                    <h6 className="text-sm">
                        Review Collection Trends
                    </h6>
                    <CardBody className="text-xs px-3 pb-0">
                        Details about review collection trends go here.
                    </CardBody>
                </Card>
            </div>
            <div className='flex gap-4 w-full'>
                <Card className="border border-text/10 w-full p-4" shadow='none'>
                    <h6 className="text-sm">
                        NFC Card Performance
                    </h6>
                    <CardBody className="text-xs px-3 pb-0">
                        NFC Card Data
                    </CardBody>
                </Card>
                <Card className="border border-text/10 w-full p-5" shadow='none'>
                    <h6 className="text-sm mb-2">
                        Location Performance
                    </h6>
                    <CardBody className="text-xs p-0 pt-4">
                        <div className='grid gap-4'>
                            {locationsData.map(({ city, averageRating, reviewsCount, growthThisMonth }, index) => (
                                <div
                                    key={index}
                                    className="text-xs bg-primary/4 flex justify-between items-center p-3 rounded-lg"
                                >
                                    <div className="flex gap-2.5 items-center">
                                        <CiLocationOn className="w-5 h-5 text-primary font-bold" />
                                        <div className="flex flex-col gap-1">
                                            <p className='font-semibold'>{city}</p>
                                            <p className="flex gap-1">
                                                <RenderStars averageRating={averageRating} /> ({reviewsCount} reviews)
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className='font-semibold'>{averageRating}</div>
                                        <div className="text-xs font-extralight">+{growthThisMonth} this month</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </CardBody>
                </Card>
            </div>
        </div>
    )
}

export default Overview