import { Card, CardBody } from '@heroui/react'
import { CiStar } from 'react-icons/ci'

const LatestReviews = () => {
  return (
      <Card className="border border-text/10" shadow='none'>
          <CardBody className="text-xs border border-text/10">
              <div className='flex justify-between items-start'>
                  <div className='flex flex-col gap-2.5'>
                      <div className='flex gap-2 items-center'>
                          <CiStar />
                          <p>Latest Reviews</p>
                      </div>
                      <div>
                          Recent feedback or reviews about the entity go here.
                      </div>
                  </div>
                  <div className='text-xs'>
                      Updated: Just now
                  </div>
              </div>
          </CardBody>
      </Card>
  )
}

export default LatestReviews