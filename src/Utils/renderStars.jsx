import { PiStar, PiStarFill } from 'react-icons/pi';

const RenderStars = ({ averageRating }) => {
    const renderStars = (averageRating) => {
        const hasHalfStar = averageRating % 1 !== 0;
        const totalStars = 5;
        const filledStars = Math.floor(averageRating);
        const emptyStars = totalStars - filledStars - (hasHalfStar ? 1 : 0);
        let stars = [];
        for (let i = 0; i < filledStars; i++) {
            stars.push(<PiStarFill key={`star-${i}`} className="inline h-4 w-4 text-yellow-400" />);
        }
        if (hasHalfStar) {
            stars.push(<PiStar key="half-star" className="inline h-4 w-4 text-yellow-400" />);
        }
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<PiStar key={`empty-star-${i}`} className="inline h-4 w-4 text-gray-200" />);
        }

        return stars;
    };
    return (
        <div>
            {renderStars(averageRating)}
        </div>
    );
};

export default RenderStars;
