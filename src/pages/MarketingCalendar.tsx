import ComponentContainer from "../components/common/ComponentContainer";

const MarketingCalendar = () => {
  const headingData = {
    heading: "Marketing Calendar",
    subHeading:
      "Plan social media, events, office visits, and marketing campaigns",
  };

  return (
    <ComponentContainer headingData={headingData}>
      Add calendar or other content here
    </ComponentContainer>
  );
};

export default MarketingCalendar;
