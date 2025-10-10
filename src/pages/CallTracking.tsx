import ComponentContainer from "../components/common/ComponentContainer";

const CallTracking = () => {
  const headingData = {
    heading: "Call Tracking",
    subHeading: "Monitor and manage your phone communications with Twilio integration.",
  };

  return (
    <ComponentContainer headingData={headingData}>
      Add your call tracking content here
    </ComponentContainer>
  );
};

export default CallTracking;
