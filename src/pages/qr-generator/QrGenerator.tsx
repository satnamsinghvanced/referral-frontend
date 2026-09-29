import { useMemo } from "react";
import ComponentContainer from "../../components/common/ComponentContainer";
import TrackingPanel from "../referral-management/TrackingPanel";
import { useTypedSelector } from "../../hooks/useTypedSelector";

export default function QrGenerator() {
  const user = useTypedSelector((state) => state.auth.user);
  const practiceTitle = (user as any)?.medicalSpecialty || (user as any)?.practiceName || user?.role || "Practice";

  const HEADING_DATA = useMemo(
    () => ({
      heading: "QR Generator",
      subHeading: `Generate personalized QR codes and NFC tags for ${practiceTitle}`,
      buttons: [],
    }),
    [practiceTitle]
  );

  return (
    <ComponentContainer headingData={HEADING_DATA}>
      <TrackingPanel />
    </ComponentContainer>
  );
}
