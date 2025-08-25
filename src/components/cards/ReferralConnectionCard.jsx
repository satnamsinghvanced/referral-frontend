import { Button, Card, CardBody, Chip, Divider, Progress, Tab, Tabs } from '@heroui/react'
import { useState } from 'react';
import { CiGlobe, CiShare1 } from 'react-icons/ci';
import { FaNoteSticky, FaUserPlus, FaUserXmark } from 'react-icons/fa6';
import { FiChevronDown, FiChevronUp, FiCircle, FiEdit, FiEye, FiPhone, FiPieChart, FiShare, FiUsers } from 'react-icons/fi';
import { IoMdCheckboxOutline } from 'react-icons/io';
import { LuBuilding2, LuCake } from 'react-icons/lu';
import { CgFileDocument } from "react-icons/cg";
import UrgencyChip from '../chips/UrgencyChip'
import { HiMiniArrowTrendingUp } from 'react-icons/hi2';
import { PiBaby } from 'react-icons/pi';
import MiniStatsCard from './MiniStatsCard';
import { GoClock } from "react-icons/go";
import { FaRegEdit } from "react-icons/fa";
import PracticeContactsCard from './PracticeContactsCard';


const StatCardData = [
    {
        icon: <HiMiniArrowTrendingUp className="text-[17px] mt-1 text-purple-500" />,
        heading: 'Referral Trend',
        value: '15',
        subheading: 'vs Last Month'
    },
    {
        icon: <GoClock className="text-[17px] mt-1 text-blue-500" />,
        heading: 'Avg Response Time',
        value: '2.4',
        subheading: 'hours'
    },
    {
        icon: <PiBaby className="text-[17px] mt-1 text-pink-500" />,
        heading: 'Family Candidates',
        value: '0',
        subheading: 'orthodontic leads'
    }
];

const practiceContactsData = [
    {
        id: 1,
        name: 'Dr. Amanda Rodriguez',
        role: 'Owner/General Dentist',
        image: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=40&h=40&fit=crop&crop=face',
        birthday: 'January 1, 1980'
    },
    {
        id: 3,
        name: 'Dr. Sarah Lee',
        role: 'Periodontist',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face',
        birthday: 'March 3, 1990'
    },
    {
        id: 2,
        name: 'Dr. John Doe',
        role: 'Orthodontist',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        birthday: 'February 2, 1985'
    },
];

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
    const urgency = 'medium'
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
                                    ? "bg-blue-100 text-blue-700"
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
                                                ? "bg-blue-100 text-blue-700"
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
                                            <a href={`https://${item.website}`} target="_blank" rel="noopener noreferrer" className='text-blue-700 cursor-pointer hover:underline'>Website</a>
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
                                            </Tab>
                                            <Tab key="tasks"
                                                title={
                                                    <div className='flex gap-2 items-center justify-center'>
                                                        <IoMdCheckboxOutline />
                                                        <p>Tasks</p>
                                                    </div>
                                                }
                                                className="text-sm">
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
                                            </Tab>
                                            <Tab key="notes"
                                                title={
                                                    <div className='flex gap-2 items-center justify-center'>
                                                        <CgFileDocument />
                                                        <p>Notes</p>
                                                    </div>
                                                }
                                                className="text-sm">
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
                                            </Tab>
                                            <Tab key="analytics"
                                                title={
                                                    <div className='flex gap-2 items-center justify-center'>
                                                        <FiPieChart />
                                                        <p>Analytics</p>
                                                    </div>
                                                }
                                                className="text-sm">
                                                <Card className="border-none  shadow-none">
                                                    <h6 className='py-1'>Practice Analytics                                                    </h6>
                                                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 justify-between">
                                                        {StatCardData.map((data, index) => (
                                                            <MiniStatsCard key={index} cardData={data} />
                                                        ))}
                                                    </div>
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