import React from "react";
import ComponentContainer from "../components/common/ComponentContainer";

const Analytics: React.FC = () => {
  const headingData: {
    heading: string;
    subHeading?: string;
    buttons?: undefined;
  } = {
    heading: "Analytics Overview",
    subHeading: "Analytics ",
  };

  return (
    <ComponentContainer headingData={headingData}>
      Put your content here
    </ComponentContainer>
  );
};

export default Analytics;
