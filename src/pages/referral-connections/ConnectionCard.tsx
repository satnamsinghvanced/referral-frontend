import { FiEdit } from 'react-icons/fi';
import { LuBuilding2 } from 'react-icons/lu';
import LevelChip from '../../components/chips/LevelChip';

interface ReferralCardProps {
    referral: {
        id: string;
        name: string;
        address: string;
        phone: string;
        referrals: number;
        level: string;
        levelColor?: string;
        score: number;
    };
}

const ReferralConnectionCard = ({ referral }: ReferralCardProps) => {
    return (
        <div className="flex justify-between border border-text/10 dark:border-background/20 rounded-lg p-4 bg-background dark:bg-text">
            <div className='w-20 aspect-square bg-primary-100 text-primary-600 h-full p-0.5 mr-2 rounded-lg flex justify-center items-center'>
                <LuBuilding2 className="text-[22px]" />
            </div>
            <div className="font-medium text-sm w-full h-full">
                {referral.name}
                <div className="flex gap-2 items-center text-xs font-light  mt-0.5">
                    <div className="flex gap-1 items-center !font-extralight">
                        {referral.address}
                    </div>
                    <div className="p-0.5 bg-text/50 rounded-full aspect-square h-fit w-fit !font-extralight"></div>
                    <div>{referral.phone}</div>
                </div>
            </div>
            <div className="flex text-center justify-end h-full w-full gap-5 text-sm">
                <div className="flex flex-col items-center text-center justify-center">
                    <p className="text-sm font-semibold">{referral.referrals}</p>
                    <p className="text-xs font-thin">Referrals</p>
                </div>
                <div className="flex items-center text-center justify-center">
                    <LevelChip level={referral.level.toLowerCase()} />
                </div>
                <div className="flex flex-col items-center text-center justify-center">
                    <p className="text-sm font-semibold">{referral.score}</p>
                    <p className="text-xs font-thin">Score</p>
                </div>
                <div className="flex items-center text-center justify-center">
                    <FiEdit />
                </div>
            </div>
        </div>
    );
};

export default ReferralConnectionCard;




//----------------------------------

// import { Button, Card, CardBody, Chip, Divider, Progress } from '@heroui/react';
// import { useState } from 'react';
// import { CiGlobe, CiShare1 } from 'react-icons/ci';
// import { FiChevronDown, FiChevronUp, FiEdit, FiEye, FiPhone } from 'react-icons/fi';
// import { GoClock } from "react-icons/go";
// import { HiMiniArrowTrendingUp } from 'react-icons/hi2';
// import { LuBuilding2 } from 'react-icons/lu';
// import { PiBaby } from 'react-icons/pi';
// import ReferralConnectionsToggle from './Toggle';


// const StatCardData = [
//     {
//         icon: <HiMiniArrowTrendingUp className="text-[17px] mt-1 text-purple-500" />,
//         heading: 'Referral Trend',
//         value: '15',
//         subheading: 'vs Last Month'
//     },
//     {
//         icon: <GoClock className="text-[17px] mt-1 text-blue-500" />,
//         heading: 'Avg Response Time',
//         value: '2.4',
//         subheading: 'hours'
//     },
//     {
//         icon: <PiBaby className="text-[17px] mt-1 text-pink-500" />,
//         heading: 'Family Candidates',
//         value: '0',
//         subheading: 'orthodontic leads'
//     }
// ];

// const practiceContactsData = [
//     {
//         id: 1,
//         name: 'Dr. Amanda Rodriguez',
//         role: 'Owner/General Dentist',
//         image: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=40&h=40&fit=crop&crop=face',
//         birthday: 'January 1, 1980'
//     },
//     {
//         id: 3,
//         name: 'Dr. Sarah Lee',
//         role: 'Periodontist',
//         image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face',
//         birthday: 'March 3, 1990'
//     },
//     {
//         id: 2,
//         name: 'Dr. John Doe',
//         role: 'Orthodontist',
//         image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
//         birthday: 'February 2, 1985'
//     },
// ];

// const referralData = [
//     {
//         id: 1,
//         name: "Bixby Smile Center",
//         address: "456 N Cabaniss Ave, Bixby, OK 74008",
//         phone: "(918) 555-0300",
//         website: "www.bixbysmile.com",
//         category: "c",
//         score: 40,
//         totalReferrals: 28,
//         thisMonth: 3,
//         lastReferral: "Jan 12, 2024",
//         staffMembers: 1,
//         familyCandidates: 0
//     },
//     {
//         id: 2,
//         name: "Tulsa Dental Care",
//         address: "123 Main St, Tulsa, OK 74145",
//         phone: "(918) 555-0100",
//         website: "www.tulsadental.com",
//         category: "b",
//         score: 65,
//         totalReferrals: 42,
//         thisMonth: 5,
//         lastReferral: "Feb 5, 2024",
//         staffMembers: 3,
//         familyCandidates: 2
//     },
//     {
//         id: 3,
//         name: "Owasso Family Dentistry",
//         address: "789 Oak Ave, Owasso, OK 74055",
//         phone: "(918) 555-0200",
//         website: "www.owassofamilydental.com",
//         category: "a",
//         score: 85,
//         totalReferrals: 67,
//         thisMonth: 8,
//         lastReferral: "Feb 15, 2024",
//         staffMembers: 5,
//         familyCandidates: 4
//     }
// ];

// const ReferralConnectionCard = () => {
//     const [expandedCards, setExpandedCards] = useState({});
//     const urgency = 'medium'
//     const handleViewDetails = (id: any) => {
//         setExpandedCards(prev => ({
//             ...prev,
//             [id]: !prev[id]
//         }));
//     };

//     return (
//         <>
//             {referralData.map((item) => (
//                 <Card key={item.id} className='min-w-[210px] p-2 text-xs font-extralight text-text/80 border border-text/10 hover:shadow-md transition-all ease-in-out duration-300' shadow='none' >
//                     <CardBody>
//                         <div className='flex justify-between'>
//                             <div className='flex gap-3 items-center'>
//                                 <div className={`rounded-lg p-2.5 ${item.category === "a"
//                                     ? "bg-blue-100 text-blue-700"
//                                     : item.category === "b"
//                                         ? "bg-yellow-200 text-yellow-600"
//                                         : item.category === "c"
//                                             ? "bg-green-100 text-green-600"
//                                             : "bg-gray-100 text-gray-600"
//                                     }`}>
//                                     <LuBuilding2 className='text-2xl' />
//                                 </div>
//                                 <div className='flex flex-col gap-0.5'>
//                                     <div className='flex items-center gap-1.5'>
//                                         <div className='text-sm font-semibold text-text'>
//                                             {item.name}
//                                         </div>
//                                         <Chip
//                                             size="sm"
//                                             className={`capitalize ${item.category === "a"
//                                                 ? "bg-blue-100 text-blue-700"
//                                                 : item.category === "b"
//                                                     ? "bg-yellow-200 text-yellow-600"
//                                                     : item.category === "c"
//                                                         ? "bg-green-100 text-green-600"
//                                                         : "bg-gray-100 text-gray-600"
//                                                 }`}
//                                         >
//                                             {item.category} Level
//                                         </Chip>
//                                     </div>
//                                     <div>{item.address}</div>
//                                     <div className='flex gap-3'>
//                                         <div className='flex gap-1 items-center'>
//                                             <FiPhone />
//                                             <span>{item.phone}</span>
//                                         </div>
//                                         <div className='flex gap-1 items-center'>
//                                             <CiGlobe />
//                                             <a href={`https://${item.website}`} target="_blank" rel="noopener noreferrer" className='text-blue-700 cursor-pointer hover:underline'>Website</a>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className='mb-2 flex flex-col gap-1 items-end justify-start'>
//                                 <div className='flex gap-2 justify-center items-center w-full'>
//                                     <p>{item.score}/100</p>
//                                     <Progress aria-label="Loading..." className="max-w-md" value={item.score} size='sm' color='success' />
//                                 </div>
//                                 <div>Relationship Score</div>
//                             </div>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-4">
//                             <div>
//                                 <p>Total Referrals</p>
//                                 <p className='text-sm text-text font-semibold'>{item.totalReferrals}</p>
//                             </div>
//                             <div>
//                                 <p>This Month</p>
//                                 <p className='text-sm text-text font-semibold'>{item.thisMonth}</p>
//                             </div>
//                             <div>
//                                 <p>Last Referral</p>
//                                 <p className='text-sm text-text font-semibold'>{item.lastReferral}</p>
//                             </div>
//                             <div>
//                                 <p>Staff Members</p>
//                                 <p className='text-sm text-text font-semibold'>{item.staffMembers}</p>
//                             </div>
//                             <div>
//                                 <p>Family Candidates</p>
//                                 <p className='text-sm text-text font-semibold'>{item.familyCandidates}</p>
//                             </div>
//                         </div>
//                         <Divider className='my-4' />
//                         <div className='flex gap-2'>
//                             <Button
//                                 size='sm'
//                                 className={`bg-transparent border border-text/30`}
//                                 startContent={<FiEye />}
//                                 endContent={expandedCards[item.id] ? <FiChevronUp /> : <FiChevronDown />}
//                                 onPress={() => handleViewDetails(item.id)}
//                             >
//                                 View Details
//                             </Button>
//                             <Button
//                                 size='sm'
//                                 className={`bg-transparent border border-text/30`}
//                                 startContent={<FiEdit />}
//                             >
//                                 Edit
//                             </Button>
//                             <Button
//                                 size='sm'
//                                 className={`bg-transparent border border-text/30`}
//                                 startContent={<CiShare1 className='font-extrabold' />}
//                             >
//                                 Navigate
//                             </Button>
//                         </div>
//                         {
//                             expandedCards[item.id] &&
//                             <>
//                                 <Divider className='my-4' />
//                                 <div>
//                                     <div className="flex w-full flex-col">
//                                         <ReferralConnectionsToggle
//                                             StatCardData={StatCardData}
//                                             practiceContactsData={practiceContactsData}
//                                             urgency={urgency}
//                                         />
//                                     </div>
//                                 </div>
//                             </>

//                         }
//                     </CardBody>
//                 </Card >
//             ))}
//         </>
//     )
// }

// export default ReferralConnectionCard