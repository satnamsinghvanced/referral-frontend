import ComponentContainer from "../components/common/ComponentContainer";

const Reports = () => {
  const headingData = {
    heading: "Marketing Reports",
    subHeading:
      "Generate comprehensive reports on all aspects of your marketing performance",
  };

  return (
    <ComponentContainer headingData={headingData}>
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800 flex items-center">
          <span className="text-xl mr-2">🚧</span>
          <span className="font-medium mr-1">Tab In Development:</span>This
          section is currently under active development. Comprehensive marketing
          and other reports will be available soon.
        </p>
      </div>
    </ComponentContainer>
  );
};

export default Reports;
