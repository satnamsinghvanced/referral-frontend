import { useMemo } from "react";
import ComponentContainer from "../../components/common/ComponentContainer";
import TrackingPanel from "../referral-management/TrackingPanel";

export default function QrGenerator() {
  const HEADING_DATA = useMemo(
    () => ({
      heading: "QR Generator",
      subHeading:
        "Generate personalized QR codes and NFC tags for General Practice",
      buttons: [],
    }),
    []
  );

  return (
    <ComponentContainer headingData={HEADING_DATA}>
      <TrackingPanel />
    </ComponentContainer>
  );
}
