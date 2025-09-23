import ComponentContainer from "../components/common/ComponentContainer"


const SocialMedia = () => {
  const headingDate = {
    heading: 'Social Media Management',
    subHeading: "Manage posts, view analytics, and engage with your audience across all platforms",
  }

  return (
    <ComponentContainer
      headingDate={headingDate}
      children={<> </>} 
    >
    </ComponentContainer>
  )
}

export default SocialMedia