import { DatePicker, Input, Switch } from "@heroui/react";
import clsx from "clsx";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { CampaignData, CampaignStepProps } from "./CampaignActionModal";
import {
  getLocalTimeZone,
  now,
  parseAbsoluteToLocal,
} from "@internationalized/date";

export interface CampaignStepRef {
  triggerValidationAndProceed: () => void;
}

const CampaignScheduleStep: React.ForwardRefRenderFunction<
  CampaignStepRef,
  CampaignStepProps
> = ({ data, onNext, validationErrors, setIsStepValid }, ref) => {
  const [sendImmediately, setSendImmediately] = useState<boolean>(
    data.schedule.sendImmediately,
  );
  const [trackOpens, setTrackOpens] = useState(data.tracking.trackOpens);
  const [trackClicks, setTrackClicks] = useState(data.tracking.trackClicks);
  const [sendDate, setSendDate] = useState<string | undefined>(
    data.schedule.date,
  );
  const [localError, setLocalError] = useState<boolean>(false);

  const error = localError || (validationErrors.schedule as any)?.date;

  React.useEffect(() => {
    if (sendImmediately) {
      setIsStepValid(true);
    } else {
      setIsStepValid(!!sendDate);
    }
  }, [sendImmediately, sendDate, setIsStepValid]);

  const handleValidationAndNext = () => {
    if (!sendImmediately && !sendDate) {
      setLocalError(true);
      return false;
    }
    setLocalError(false);

    onNext({
      schedule: {
        sendImmediately,
        date: sendDate || undefined,
      },
      tracking: {
        trackOpens,
        trackClicks,
      },
    });
    return true;
  };

  useImperativeHandle(ref, () => ({
    triggerValidationAndProceed: handleValidationAndNext,
  }));

  const handleToggleScheduleLater = (val: boolean) => {
    setSendImmediately(!val);
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Schedule & Tracking</h4>

      <div className="pt-2">
        <Switch
          size="sm"
          isSelected={!sendImmediately}
          onValueChange={handleToggleScheduleLater}
          classNames={{
            label: "text-sm text-gray-700 dark:text-foreground/70",
          }}
        >
          Schedule for later
        </Switch>

        {!sendImmediately && (
          <div className="mt-4">
            <DatePicker
              id="scheduleDate"
              name="scheduleDate"
              label="Date and Time"
              labelPlacement="outside"
              size="sm"
              radius="sm"
              minValue={now(getLocalTimeZone())}
              defaultValue={
                sendDate && sendDate !== ""
                  ? parseAbsoluteToLocal(new Date(sendDate).toISOString())
                  : null
              }
              onChange={(dateObject: any) => {
                if (dateObject) {
                  const date = dateObject.toDate(getLocalTimeZone());
                  setSendDate(date.toISOString());
                  setLocalError(false);
                } else {
                  setSendDate(undefined);
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

      {/* <div>
        <Switch
          size="sm"
          isSelected={trackOpens}
          onValueChange={setTrackOpens}
          classNames={{
            label: "text-sm text-gray-700 dark:text-foreground/70",
          }}
        >
          Track email opens
        </Switch>
      </div>
      <div>
        <Switch
          size="sm"
          isSelected={trackClicks}
          onValueChange={setTrackClicks}
          classNames={{
            label: "text-sm text-gray-700 dark:text-foreground/70",
          }}
        >
          Track email clicks
        </Switch>
      </div> */}
    </div>
  );
};

export default forwardRef(CampaignScheduleStep);
