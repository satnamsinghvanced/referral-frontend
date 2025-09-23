import { Card, CardBody } from '@heroui/react'
import { CgFileDocument } from 'react-icons/cg'

const ReferralConnectionsNotes = () => {
    return (
        <Card className="border border-text/10" shadow='none'>
            <CardBody className="text-xs border border-text/10">
                <div className='flex justify-between items-start '>
                    <div className='flex flex-col  gap-2.5'>
                        <div className='flex gap-2 items-center'>
                            <CgFileDocument />
                            <p>Practice Notes</p>
                        </div>
                        <div>
                            Excellent partnership. Dr. Wilson consistently sends high-quality referrals.
                        </div>
                    </div>
                    <div className='text-xs'>
                        Updated recently
                    </div>

                </div>
            </CardBody>
        </Card>
    )
}

export default ReferralConnectionsNotes