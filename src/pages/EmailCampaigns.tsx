import ComponentContainer from "../components/common/ComponentContainer";

const EmailCampaigns = () => {
  const headingData = {
    heading: "Email Campaigns",
    subHeading: "Create and manage email campaigns for your referral network.",
  };

  return (
    <ComponentContainer headingData={headingData}>
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800 flex items-center">
          <span className="text-xl mr-2">🚧</span>
          <span className="font-medium mr-1">Tab In Development:</span> This section
          is currently under active development. Email campaign creation and
          management tools will be available soon.
        </p>
      </div>
    </ComponentContainer>
  );
};

export default EmailCampaigns;
