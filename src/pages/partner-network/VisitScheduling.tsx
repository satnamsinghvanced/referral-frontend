import { Button, Card, CardBody } from '@heroui/react';
import { useState } from 'react';
import { FaList } from 'react-icons/fa6';
import { HiCalendarDateRange } from 'react-icons/hi2';
import { MdGridOn } from "react-icons/md";
import Calendar from './Calendar';

const PartnerNetworkVisitScheduling = () => {
    const [isList, setIsList] = useState(true)

    const toggleList = () => {
        setIsList(!isList)
    }


    return (
        <div>
            <h3 className="flex gap-2 text-sm font-semibold ">Visit Scheduling</h3>
            <p className="text-xs mt-1  text-foreground/80">Plan and manage office visits</p>
            <Card className="border border-foreground/10 w-full p-5 mt-3" shadow='none'>
                <div className='flex justify-between'>
                    <div>
                        <h6 className="text-sm mb-0.5">
                            Scheduled Visits
                        </h6>
                        <p className="text-xs text-foreground/80">Manage your upcoming office visits</p>
                    </div>
                    <div className='flex gap-2'>
                        <Button size='sm' className={`p-0 border ${isList ? 'bg-foreground text-background border-transparent' : 'border-foreground/20 bg-transparent'}`} onPress={toggleList} startContent={<></>}>
                            <FaList /> List
                        </Button>
                        <Button size='sm' className={`p-0 px-2 w-fit border ${isList ? 'border-foreground/20 bg-transparent' : 'bg-foreground text-background border-transparent'}`} onPress={toggleList} >
                            <MdGridOn className='w-4 h-4' /> Calendar
                        </Button>
                    </div>
                </div>
                <CardBody className="text-xs p-0 pt-4">

                    {
                        !isList ?
                            <div className='p-4 flex flex-col justify-center items-center min-h-[280px] h-full text-foreground/50'>
                                <HiCalendarDateRange className='w-12 h-12' />
                                <p className='text-sm'>No visits scheduled yet</p>
                                <p className='text-sm'>Click "Schedule Visit" to add your first visit</p>
                            </div>
                            :
                            <div className='p-4 flex flex-col justify-center items-center min-h-[280px] h-full text-foreground/50'>                              
                                <Calendar />
                            </div>
                    }
                </CardBody>
            </Card>
        </div>
    )
}

export default PartnerNetworkVisitScheduling