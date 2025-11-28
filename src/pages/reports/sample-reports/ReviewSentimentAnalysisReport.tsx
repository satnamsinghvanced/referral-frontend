import { IoArrowBack } from "react-icons/io5";
import ComponentContainer from "../../../components/common/ComponentContainer";
import { useNavigate } from "react-router";

const ReviewSentimentAnalysisReport = () => {
  const navigate = useNavigate();

  const HEADING_DATA = {
    heading: "Sample Report",
    subHeading: "Preview of comprehensive review sentiment analysis",
    buttons: [
      {
        label: "Back to Reports",
        onClick: () => navigate(-1),
        icon: <IoArrowBack fontSize={15} />,
        variant: "ghost" as const,
        color: "default" as const,
        className: "border-small",
      },
    ],
  };

  return (
    <ComponentContainer headingData={HEADING_DATA}>
      <div className="flex flex-col gap-5">{/* YOUR CONTENT GOES HERE */}</div>
    </ComponentContainer>
  );
};

export default ReviewSentimentAnalysisReport;
