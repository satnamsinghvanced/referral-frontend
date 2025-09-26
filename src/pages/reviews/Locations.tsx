import { Card, CardBody } from '@heroui/react';
import ReviewsLocationCard from './LocationCard';
import { IoLocationOutline } from 'react-icons/io5';

const Locations = () => {

    const locationData = [
        {
            location: 'Tulsa',
            totalReviews: 287,
            averageRating: 4.8,
            nfcTaps: 142,
            qrScans: 78,
        },
        {
            location: 'Oklahoma City',
            totalReviews: 150,
            averageRating: 4.5,
            nfcTaps: 110,
            qrScans: 65,
        },
        {
            location: 'Norman',
            totalReviews: 120,
            averageRating: 3.9,
            nfcTaps: 80,
            qrScans: 45,
        },
        {
            location: 'Edmond',
            totalReviews: 98,
            averageRating: 4.2,
            nfcTaps: 67,
            qrScans: 52,
        }

    ];

    return (
        <div className='flex flex-col gap-6 bg-background  border border-foreground/20  rounded-xl p-5'>
            <h4 className='flex items-center'>
                <IoLocationOutline className="text-primary w-4 h-4 mr-2" />

                Review Performance by Location</h4>
            <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4'>
                <ReviewsLocationCard locations={locationData} />
            </div>
            {/* <Card className="border border-foreground/10 p-4" shadow='none'>
                <h6 className="text-sm">
                    Monthly Review Collection by Location
                </h6>
                <CardBody className="text-xs px-3 pb-0">
                    Monthly Review Collection by Location -- GRAPH
                </CardBody>
            </Card> */}
        </div>
    )
}

export default Locations