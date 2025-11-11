import ComponentContainer from "../components/common/ComponentContainer";

const MarketingBudget = () => {
  const headingData = {
    heading: "Marketing Budget",
    subHeading: "Manage and track your marketing spend across all channels.",
  };

  return (
    <ComponentContainer headingData={headingData}>
      Add your marketing budget content here
    </ComponentContainer>
  );
};

export default MarketingBudget;
