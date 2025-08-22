import { Button, Card, CardBody, Chip, Divider, Progress, Tab, Tabs } from '@heroui/react'
import { useState } from 'react';
import { CiGlobe, CiShare1 } from 'react-icons/ci';
import { FaNoteSticky } from 'react-icons/fa6';
import { FiChevronDown, FiChevronUp, FiEdit, FiEye, FiPhone, FiPieChart, FiShare, FiUsers } from 'react-icons/fi';
import { IoMdCheckboxOutline } from 'react-icons/io';
import { LuBuilding2 } from 'react-icons/lu';
import { CgFileDocument } from "react-icons/cg";

// Create an array of 3 referral entries
const referralData = [
    {
        id: 1,
        name: "Bixby Smile Center",
        address: "456 N Cabaniss Ave, Bixby, OK 74008",
        phone: "(918) 555-0300",
        website: "www.bixbysmile.com",
        category: "c",
        score: 40,
        totalReferrals: 28,
        thisMonth: 3,
        lastReferral: "Jan 12, 2024",
        staffMembers: 1,
        familyCandidates: 0
    },
    {
        id: 2,
        name: "Tulsa Dental Care",
        address: "123 Main St, Tulsa, OK 74145",
        phone: "(918) 555-0100",
        website: "www.tulsadental.com",
        category: "b",
        score: 65,
        totalReferrals: 42,
        thisMonth: 5,
        lastReferral: "Feb 5, 2024",
        staffMembers: 3,
        familyCandidates: 2
    },
    {
        id: 3,
        name: "Owasso Family Dentistry",
        address: "789 Oak Ave, Owasso, OK 74055",
        phone: "(918) 555-0200",
        website: "www.owassofamilydental.com",
        category: "a",
        score: 85,
        totalReferrals: 67,
        thisMonth: 8,
        lastReferral: "Feb 15, 2024",
        staffMembers: 5,
        familyCandidates: 4
    }
];

const ReferralConnectionCard = () => {
    const [expandedCards, setExpandedCards] = useState({});

    const handleViewDetails = (id) => {
        setExpandedCards(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <>
            {referralData.map((item) => (
                <Card key={item.id} className='min-w-[210px] p-2 text-xs font-extralight text-text/80 border border-text/10 hover:shadow-md transition-all ease-in-out duration-300' shadow='none' >
                    <CardBody>
                        <div className='flex justify-between'>
                            <div className='flex gap-3 items-center'>
                                <div className={`rounded-lg p-2.5 ${item.category === "a"
                                    ? "bg-blue-100 text-blue-600"
                                    : item.category === "b"
                                        ? "bg-yellow-200 text-yellow-600"
                                        : item.category === "c"
                                            ? "bg-green-100 text-green-600"
                                            : "bg-gray-100 text-gray-600"
                                    }`}>
                                    <LuBuilding2 className='text-2xl' />
                                </div>
                                <div className='flex flex-col gap-0.5'>
                                    <div className='flex items-center gap-1.5'>
                                        <div className='text-sm font-semibold text-text'>
                                            {item.name}
                                        </div>
                                        <Chip
                                            size="sm"
                                            className={`capitalize ${item.category === "a"
                                                ? "bg-blue-100 text-blue-600"
                                                : item.category === "b"
                                                    ? "bg-yellow-200 text-yellow-600"
                                                    : item.category === "c"
                                                        ? "bg-green-100 text-green-600"
                                                        : "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            {item.category} Level
                                        </Chip>
                                    </div>
                                    <div>{item.address}</div>
                                    <div className='flex gap-3'>
                                        <div className='flex gap-1 items-center'>
                                            <FiPhone />
                                            <span>{item.phone}</span>
                                        </div>
                                        <div className='flex gap-1 items-center'>
                                            <CiGlobe />
                                            <a href={`https://${item.website}`} target="_blank" rel="noopener noreferrer" className='text-blue-600 cursor-pointer hover:underline'>Website</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='mb-2 flex flex-col gap-1 items-end justify-start'>
                                <div className='flex gap-2 justify-center items-center w-full'>
                                    <p>{item.score}/100</p>
                                    <Progress aria-label="Loading..." className="max-w-md" value={item.score} size='sm' color='success' />
                                </div>
                                <div>Relationship Score</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-4">
                            <div>
                                <p>Total Referrals</p>
                                <p className='text-sm text-text font-semibold'>{item.totalReferrals}</p>
                            </div>
                            <div>
                                <p>This Month</p>
                                <p className='text-sm text-text font-semibold'>{item.thisMonth}</p>
                            </div>
                            <div>
                                <p>Last Referral</p>
                                <p className='text-sm text-text font-semibold'>{item.lastReferral}</p>
                            </div>
                            <div>
                                <p>Staff Members</p>
                                <p className='text-sm text-text font-semibold'>{item.staffMembers}</p>
                            </div>
                            <div>
                                <p>Family Candidates</p>
                                <p className='text-sm text-text font-semibold'>{item.familyCandidates}</p>
                            </div>
                        </div>
                        <Divider className='my-4' />
                        <div className='flex gap-2'>
                            <Button
                                size='sm'
                                className={`bg-transparent border border-text/30`}
                                startContent={<FiEye />}
                                endContent={expandedCards[item.id] ? <FiChevronUp /> : <FiChevronDown />}
                                onPress={() => handleViewDetails(item.id)}
                            >
                                View Details
                            </Button>
                            <Button
                                size='sm'
                                className={`bg-transparent border border-text/30`}
                                startContent={<FiEdit />}
                            >
                                Edit
                            </Button>
                            <Button
                                size='sm'
                                className={`bg-transparent border border-text/30`}
                                startContent={<CiShare1 className='font-extrabold' />}
                            >
                                Navigate
                            </Button>
                        </div>
                        {
                            expandedCards[item.id] &&
                            <>
                                <Divider className='my-4' />
                                <div>
                                    <div className="flex w-full flex-col">
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
                                                <Card className="border-none py-7">
                                                    <CardBody className="text-sm">
                                                        Manage your contacts here. You can add, remove, and edit contact details.
                                                    </CardBody>
                                                </Card>
                                            </Tab>
                                            <Tab key="tasks"
                                                title={
                                                    <div className='flex gap-2 items-center justify-center'>
                                                        <IoMdCheckboxOutline />
                                                        <p>Tasks</p>
                                                    </div>
                                                }
                                                className="text-sm">
                                                <Card className="border-none py-10">
                                                    <CardBody className="text-sm">
                                                        View and organize your tasks. Add new tasks, mark them as complete, and prioritize.
                                                    </CardBody>
                                                </Card>
                                            </Tab>
                                            <Tab key="notes"
                                                title={
                                                    <div className='flex gap-2 items-center justify-center'>
                                                        <CgFileDocument />
                                                        <p>Notes</p>
                                                    </div>
                                                }
                                                className="text-sm">
                                                <Card className="border-none py-2">
                                                    <CardBody className="text-sm">
                                                        Keep track of your notes, ideas, and to-dos here. Organize your thoughts in a single space.
                                                    </CardBody>
                                                </Card>
                                            </Tab>
                                            <Tab key="analytics"
                                                title={
                                                    <div className='flex gap-2 items-center justify-center'>
                                                        <FiPieChart />
                                                        <p>Analytics</p>
                                                    </div>
                                                }
                                                className="text-sm">
                                                <Card className="border-none py-4">
                                                    <CardBody className="text-sm">
                                                        Review the analytics and insights of your activities. Track progress, metrics, and reports.
                                                    </CardBody>
                                                </Card>
                                            </Tab>
                                        </Tabs>
                                    </div>
                                </div>
                            </>

                        }
                    </CardBody>
                </Card >
            ))}
        </>
    )
}

export default ReferralConnectionCard