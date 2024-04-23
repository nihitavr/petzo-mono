import { Button } from "@petzo/ui/components/button";
import Loader from "@petzo/ui/components/loader";

export default function FormSaveButton({
  disabled,
  isSubmitting,
}: {
  disabled: boolean;
  isSubmitting: boolean;
}) {
  return (
    <div
      className={`md:initial fixed bottom-0 left-0 z-50 flex w-full justify-end px-3 py-3 md:static`}
    >
      <Button
        className="flex w-full items-center justify-center gap-2 md:w-32"
        type="submit"
        disabled={disabled || isSubmitting}
      >
        <span>Save</span>
        <div>
          <Loader className="h-5 w-5 border-2" show={isSubmitting} />
        </div>
      </Button>
    </div>
  );
}
