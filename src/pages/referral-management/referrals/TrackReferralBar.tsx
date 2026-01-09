import { Button } from "@heroui/react";
import { FiPlus, FiUpload } from "react-icons/fi";

interface TrackReferralBarProps {
  onTrackReferral: () => void;
  onImport: () => void;
}

const TrackReferralBar = ({
  onTrackReferral,
  onImport,
}: TrackReferralBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border bg-gradient-to-r from-blue-50 to-sky-50 border-blue-200">
      <div className="flex flex-col gap-1.5 text-center sm:text-left">
        <h4 className="font-medium text-sm">Track Your Referrals</h4>
        <p className="text-xs text-gray-500">
          Add referrals individually or import them in bulk from a spreadsheet
        </p>
      </div>
      <div className="flex items-center gap-2.5 w-full sm:w-auto">
        <Button
          size="sm"
          radius="sm"
          variant="solid"
          color="primary"
          startContent={<FiPlus className="text-[15px]" />}
          onPress={onTrackReferral}
        >
          Add Referral
        </Button>
        <Button
          startContent={<FiUpload className="text-[15px]" />}
          onPress={onImport}
          size="sm"
          radius="sm"
          className="bg-white border border-gray-200 text-gray-700"
        >
          Import from Spreadsheet
        </Button>
      </div>
    </div>
  );
};

export default TrackReferralBar;
