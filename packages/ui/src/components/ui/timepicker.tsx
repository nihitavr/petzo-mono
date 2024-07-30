import React, { useState } from "react";
import { ClockIcon } from "@radix-ui/react-icons";
import * as Popover from "@radix-ui/react-popover";
import TimePicker from "react-time-picker";

import "react-time-picker/dist/TimePicker.css";

import "react-clock/dist/Clock.css";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
}

const ShadcnTimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button className="inline-flex w-[280px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
          {value || "Pick a time"}
          <ClockIcon className="h-4 w-4 opacity-50" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none"
          sideOffset={5}
        >
          <TimePicker
            onChange={(newValue) => {
              onChange(newValue!);
              setOpen(false);
            }}
            value={value}
            format="HH:mm"
            disableClock={true}
            minuteStep={30}
            className="react-time-picker"
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default ShadcnTimePicker;
