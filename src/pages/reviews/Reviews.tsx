import { CiMobile2 } from "react-icons/ci";
import { FiStar, FiTarget } from 'react-icons/fi';
import { LuBuilding2 } from 'react-icons/lu';
import { PiMedalLight } from 'react-icons/pi';
import ReviewStatsCard from '../../components/cards/ReviewStatsCard';
import ComponentContainer from '../../components/common/ComponentContainer';
import RenderStars from "../../Utils/renderStars";
import ReviewToggle from "./Toggle";

const Reviews = () => {
  const headingDate = {
    heading: 'Reviews Management',
    subHeading: "Track Google reviews and NFC card performance across all locations",
  }


  const StatCardData = [

    {
      icon: <FiStar className="h-full w-full text-yellow-500" />,
      heading: 'Total Reviews',
      value: '641',
      subheading: (<p className='text-green-500'>stars</p>)
    },
    {
      icon: <PiMedalLight className="h-full w-full text-sky-500" />,
      heading: 'Average Rating',
      value: 3.8,
      subheading: (<RenderStars averageRating={4.8} />)
    },
    {
      icon: <CiMobile2 className="h-full w-full text-purple-500 font-extrabold" />,
      heading: 'NFC Card Taps',
      value: '906',
      subheading: (<p className='text-green-500'>+12.5%</p>)
    },
    {
      icon: <FiTarget className="h-full w-full text-green-500" />,
      heading: 'NFC to Reviews',
      value: '175',
      subheading: (<p className='text-sky-500'>19.2% rate</p>)
    },
    {
      heading: 'Active Locations',
      value: '3',
      icon: <LuBuilding2 className="h-full w-full text-orange-500" />,
      subheading: 'Tulsa, Jenks, Bixby'
    },
  ];
  return (
    <ComponentContainer
      headingDate={headingDate}
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols md:grid-cols-3 xl:grid-cols-5 gap-4">
          {StatCardData.map((card, index) => (
            <ReviewStatsCard
              key={index}
              cardHeading={card.heading}
              cardStat={card.value}
              subheading={card.subheading}
              cardIcon={card.icon}
            />
          ))}
        </div>




        <ReviewToggle />

      </div>







    </ComponentContainer>
  )
}

export default Reviews