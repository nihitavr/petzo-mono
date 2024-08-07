import { Button } from "@petzo/ui/components/button";
import { Label } from "@petzo/ui/components/label";
import Loader from "@petzo/ui/components/loader";

export default function FormSaveButton({
  disabled,
  isSubmitting,
  name,
  label,
}: {
  disabled: boolean;
  isSubmitting: boolean;
  name?: string;
  label?: string;
}) {
  return (
    <div
      className={`md:initial fixed bottom-0 left-0 z-50 flex w-full min-w-32 justify-end px-3 py-3 md:static md:px-0`}
    >
      <div className="flex w-full flex-col items-end">
        {label && <Label className="mr-2 text-sm">{label}</Label>}
        <Button
          className="flex w-full items-center justify-center gap-2 md:min-w-32"
          type="submit"
          disabled={disabled || isSubmitting}
        >
          <span>{name ? name : "Save"}</span>
          <Loader className="h-5 w-5 shrink-0 border-2" show={isSubmitting} />
        </Button>
      </div>
    </div>
  );
}
