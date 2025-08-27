import { Card, CardBody, Tab, Tabs } from '@heroui/react'
import { CgFileDocument } from 'react-icons/cg'
import { FiCircle, FiPieChart, FiUsers } from 'react-icons/fi'
import { IoMdCheckboxOutline } from 'react-icons/io'
import MiniStatsCard from '../../components/cards/MiniStatsCard'
import UrgencyChip from '../../components/chips/UrgencyChip'
import ReferralConnectionsContacts from './Contacts'
import ReferralConnectionsTasks from './Tasks'
import ReferralConnectionsNotes from './Notes'
import ReferralConnectionsAnalytics from './Analytics'

const ReferralConnectionsToggle = ({ StatCardData, practiceContactsData, urgency }) => {
    return (
        <Tabs aria-label="Options"
            classNames={{
                tabList: "flex w-full rounded-full",
                tab: "flex-1 px-4 py-1 text-sm font-medium transition-all",
                cursor: "rounded-full",
            }}
            className="text-background w-full">
            <Tab key="contacts"
                title={
                    <div className='flex gap-2 items-center justify-center'>
                        <FiUsers />
                        <p>Contacts</p>
                    </div>
                }
                className="text-sm  w-full">
                <ReferralConnectionsContacts practiceContactsData={practiceContactsData} />
            </Tab>
            <Tab key="tasks"
                title={
                    <div className='flex gap-2 items-center justify-center'>
                        <IoMdCheckboxOutline />
                        <p>Tasks</p>
                    </div>
                }
                className="text-sm">
                <ReferralConnectionsTasks urgency={urgency} />
            </Tab>
            <Tab key="notes"
                title={
                    <div className='flex gap-2 items-center justify-center'>
                        <CgFileDocument />
                        <p>Notes</p>
                    </div>
                }
                className="text-sm">
                <ReferralConnectionsNotes />
            </Tab>
            <Tab key="analytics"
                title={
                    <div className='flex gap-2 items-center justify-center'>
                        <FiPieChart />
                        <p>Analytics</p>
                    </div>
                }
                className="text-sm">
                <ReferralConnectionsAnalytics StatCardData={StatCardData} />
            </Tab>
        </Tabs>
    )
}

export default ReferralConnectionsToggle