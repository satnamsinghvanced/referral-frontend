import { DatePicker, Input, Switch } from "@heroui/react";
import clsx from "clsx";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { CampaignData } from "./CampaignActionModal";
import { getLocalTimeZone, now } from "@internationalized/date";

export interface CampaignStepRef {
  triggerValidationAndProceed: () => void;
}

interface CampaignStepProps {
  data: CampaignData;
  onNext: (data: Partial<CampaignData>) => void;
  validationErrors: Record<string, string>;
}

const CampaignScheduleStep: React.ForwardRefRenderFunction<
  CampaignStepRef,
  CampaignStepProps
> = ({ data, onNext, validationErrors }, ref) => {
  const [schedule, setSchedule] = useState<boolean>(false);
  const [trackingOpens, setTrackingOpens] = useState(data.trackingOpens);
  const [trackingClicks, setTrackingClicks] = useState(data.trackingClicks);
  const [sendDate, setSendDate] = useState<string | null>(null);
  const [localError, setLocalError] = useState<boolean>(false);

  const error = localError || validationErrors.sendDate;

  const handleValidationAndNext = () => {
    if (schedule && !sendDate) {
      setLocalError(true);
      return false;
    }
    setLocalError(false);

    onNext({
      schedule,
      trackingOpens,
      trackingClicks,
    });
    return true;
  };

  useImperativeHandle(ref, () => ({
    triggerValidationAndProceed: handleValidationAndNext,
  }));

  const handleToggleScheduleLater = (val: boolean) => {
    setSchedule(val);
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Schedule & Tracking</h4>

      <div className="pt-2">
        <Switch
          size="sm"
          isSelected={schedule}
          onValueChange={handleToggleScheduleLater}
        >
          Schedule for later
        </Switch>

        {schedule && (
          <div className="mt-4">
            <DatePicker
              id="scheduleDate"
              name="scheduleDate"
              label="Date and Time"
              labelPlacement="outside"
              size="sm"
              radius="sm"
              minValue={now(getLocalTimeZone())}
              onChange={(dateObject: any) => {
                if (dateObject) {
                  const year = dateObject.year;
                  const month = String(dateObject.month).padStart(2, "0");
                  const day = String(dateObject.day).padStart(2, "0");
                  const hour = String(dateObject.hour).padStart(2, "0");
                  const minute = String(dateObject.minute).padStart(2, "0");
                  const second = String(dateObject.second).padStart(2, "0");
                  const millisecond = String(dateObject.millisecond).padStart(
                    3,
                    "0"
                  );

                  const localDateTimeString = `${year}-${month}-${day}T${hour}:${minute}:${second}.${millisecond}Z`;

                  setSendDate(localDateTimeString);
                  if (localDateTimeString) setLocalError(false);
                } else {
                  setSendDate(null);
                }
              }}
              granularity="minute"
              isInvalid={!!error}
              errorMessage={
                error
                  ? "Please select a date and time to schedule the campaign."
                  : null
              }
              isRequired
              hideTimeZone
            />
          </div>
        )}
      </div>

      <div>
        <Switch
          size="sm"
          isSelected={trackingOpens}
          onValueChange={setTrackingOpens}
        >
          Track email opens
        </Switch>
      </div>
      <div>
        <Switch
          size="sm"
          isSelected={trackingClicks}
          onValueChange={setTrackingClicks}
        >
          Track email opens
        </Switch>
      </div>
    </div>
  );
};

export default forwardRef(CampaignScheduleStep);
