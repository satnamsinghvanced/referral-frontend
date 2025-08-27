import { Card, CardBody } from '@heroui/react';
import ReviewsLocationCard from './LocationCard'

const Locations = () => {

    const locationData = [
        {
            location: 'Tulsa',
            totalReviews: 287,
            averageRating: 4.8,
            reviewsThisMonth: 23,
            address: '123 South Yale Avenue, Tulsa, OK 74136',
            phone: '+1 (918) 555-0123'
        },
        {
            location: 'Oklahoma City',
            totalReviews: 150,
            averageRating: 4.5,
            reviewsThisMonth: 10,
            address: '456 North Broadway Avenue, Oklahoma City, OK 73102',
            phone: '+1 (405) 555-5678'
        },
        {
            location: 'Norman',
            totalReviews: 120,
            averageRating: 3.9,
            reviewsThisMonth: 5,
            address: '789 West Main Street, Norman, OK 73069',
            phone: '+1 (405) 555-1234'
        }
    ];
    return (
        <div className='flex flex-col gap-6'>
            <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
                <ReviewsLocationCard locations={locationData} />
            </div>
            <Card className="border border-text/10 p-4" shadow='none'>
                <h6 className="text-sm">
                    Monthly Review Collection by Location
                </h6>
                <CardBody className="text-xs px-3 pb-0">
                    Monthly Review Collection by Location -- GRAPH
                </CardBody>
            </Card>
        </div>
    )
}

export default Locations