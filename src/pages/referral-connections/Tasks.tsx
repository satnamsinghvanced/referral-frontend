import { Card, CardBody } from '@heroui/react'
import { FiCircle } from 'react-icons/fi'
import UrgencyChip from '../../components/chips/UrgencyChip'

interface ReferralConnectionsTasksProps {
    urgency: string;
}

const ReferralConnectionsTasks = ({ urgency }: ReferralConnectionsTasksProps) => {
  return (
      <Card className="border border-text/10" shadow='none'>
          <CardBody className="text-xs border border-text/10">
              <div className='flex justify-between items-center '>
                  <div className='flex gap-2 items-center'>
                      <FiCircle />
                      <div>
                          <p>Introduce NFC card system</p>
                          <p>Due: 2024-01-30</p>
                      </div>
                  </div>
                  <UrgencyChip urgency={urgency} />
              </div>
          </CardBody>
      </Card>
  )
}

export default ReferralConnectionsTasks