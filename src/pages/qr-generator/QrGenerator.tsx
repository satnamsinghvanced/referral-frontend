import { useMemo } from "react";
import ComponentContainer from "../../components/common/ComponentContainer";
import { useFetchTrackings } from "../../hooks/useReferral";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import TrackingPanel from "../referral-management/TrackingPanel";

export default function QrGenerator() {
  const { user } = useTypedSelector((state) => state.auth);
  const { data: trackings } = useFetchTrackings(user?.userId);

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
      <TrackingPanel trackings={trackings} />
    </ComponentContainer>
  );
}
