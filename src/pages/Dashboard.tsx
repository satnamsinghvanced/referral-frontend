import ComponentContainer from "../components/common/ComponentContainer";

const Dashboard = () => {
  const headingData = {
    heading: "Dashboard Overview",
    subHeading:
      "Welcome back! Here's what's happening with your referrals today.",
  };

  return (
    <ComponentContainer headingData={headingData}>
      Add dashboard content here if needed
    </ComponentContainer>
  );
};

export default Dashboard;
