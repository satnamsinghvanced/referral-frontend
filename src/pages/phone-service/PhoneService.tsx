import ComponentContainer from "../../components/common/ComponentContainer";
import TwilioDashboard from "../integrations/components/TwilioDashboard";
import { useFetchTwilioConfig } from "../../hooks/integrations/useTwilio";

export default function PhoneService() {
  const { data: twilioConfig } = useFetchTwilioConfig();

  const HEADING_DATA = {
    heading: "Phone Service Integration",
    subHeading:
      "Manage phone numbers, call tracking, and SMS communication through Practice ROI",
    buttons: [],
  };

  return (
    <ComponentContainer headingData={HEADING_DATA}>
      <TwilioDashboard twilioConfig={twilioConfig} />
    </ComponentContainer>
  );
}
