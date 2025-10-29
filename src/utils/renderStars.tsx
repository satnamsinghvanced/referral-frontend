import { FC, JSX } from "react";
import { PiStar, PiStarFill } from "react-icons/pi";

interface RenderStarsProps {
  averageRating: number;
}

const RenderStars: FC<RenderStarsProps> = ({ averageRating }) => {
  const renderStars = (rating: number): JSX.Element[] => {
    const hasHalfStar = rating % 1 !== 0;
    const totalStars = 5;
    const filledStars = Math.floor(rating);
    const emptyStars = totalStars - filledStars - (hasHalfStar ? 1 : 0);

    const stars: JSX.Element[] = [];

    for (let i = 0; i < filledStars; i++) {
      stars.push(
        <PiStarFill
          key={`star-${i}`}
          className="inline h-4 w-4 text-yellow-400"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <PiStar key="half-star" className="inline h-4 w-4 text-yellow-400" />
      );
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <PiStar
          key={`empty-star-${i}`}
          className="inline h-4 w-4 text-gray-200"
        />
      );
    }

    return stars;
  };

  return <div>{renderStars(averageRating)}</div>;
};

export default RenderStars;
