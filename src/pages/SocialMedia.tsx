import ComponentContainer from "../components/common/ComponentContainer";

const SocialMedia = () => {
  const headingData = {
    heading: 'Social Media Management',
    subHeading: "Manage posts, view analytics, and engage with your audience across all platforms",
  };

  return (
    <ComponentContainer headingData={headingData}>
      Add your social media management content here
    </ComponentContainer>
  );
};

export default SocialMedia;
