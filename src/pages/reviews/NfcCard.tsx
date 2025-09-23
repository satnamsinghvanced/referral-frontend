import { Card, CardBody } from '@heroui/react'
import { FiCreditCard } from 'react-icons/fi'

const NfcCard = () => {
    return (
        <Card className="border border-text/10" shadow='none'>
            <CardBody className="text-xs border border-text/10">
                <div className='flex justify-between items-start'>
                    <div className='flex flex-col gap-2.5'>
                        <div className='flex gap-2 items-center'>
                            <FiCreditCard />
                            <p>NFC Card Info</p>
                        </div>
                        <div>
                            NFC card related details and functionality can be added here.
                        </div>
                    </div>
                    <div className='text-xs'>
                        Last synced: 10 minutes ago
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}

export default NfcCard