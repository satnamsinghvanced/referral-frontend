import { Card, CardBody } from "@heroui/react"
import { FaPhoneAlt, FaRegEdit } from "react-icons/fa"
import { FaUserXmark } from "react-icons/fa6"
import { LuCake } from "react-icons/lu"

const PracticeContactsCard = ({ practiceContactsData }) => {
    return (
        <>
            {
                practiceContactsData.length > 0 ?
                    practiceContactsData?.map(({ id, name, role, birthday, image }) => (
                        <Card key={id} className="border border-text/10" shadow='none'>
                            <CardBody className="text-xs border border-text/10">
                                <div className='flex justify-between items-start '>
                                    <div>
                                        <div className='flex gap-2 items-center'>
                                            <img src={image} alt='img' className='rounded-full' />
                                            <div>
                                                <p className='font-bold'>{name}</p>
                                                <p>{role}</p>
                                                <p className='border border-text/10 px-1 rounded-sm'>{role}</p>
                                            </div>
                                        </div>
                                        <div className='mt-2 flex items-center gap-2'>
                                            <LuCake />
                                            <p>{birthday}</p>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-2.5'>
                                        <FaRegEdit className='w-4 h-4 cursor-pointer' />
                                        <FaUserXmark className='text-red-500 w-4 h-4 cursor-pointer' />
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    ))
                    :
                    <div>
                        <p>No practice contacts available</p>
                    </div>

            }
        </>
    )
}

export default PracticeContactsCard