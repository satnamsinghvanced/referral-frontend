import { Button } from '@heroui/react'
import { FaUserPlus } from 'react-icons/fa6'
import PracticeContactsCard from './ContactsCard'

const ReferralConnectionsContacts = ({ practiceContactsData }) => {
    return (
        <div className='flex flex-col gap-3'>
            <div className='flex justify-between items-center'>
                <h6 className='mb-1.5'>   Practice Contacts {' '} &#40;{practiceContactsData.length} &#41;</h6>
                <Button size='sm' className='bg-text text-background' startContent={<FaUserPlus />}>
                    Add Contact
                </Button>
            </div>
            <div className='grid grid-cols-1 md:grid-cols- xl:grid-cols-3 gap-4'>
                <PracticeContactsCard practiceContactsData={practiceContactsData} />
            </div>
        </div>
    )
}

export default ReferralConnectionsContacts