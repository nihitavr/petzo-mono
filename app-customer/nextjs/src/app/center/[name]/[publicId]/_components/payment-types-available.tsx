import { PiMoney } from "react-icons/pi";

export default function PaymentTypesAvailable() {
  return (
    <div className="flex items-center gap-1">
      <PiMoney strokeWidth={2} />
      <span className="text-xs font-medium text-green-700 md:text-2sm">
        Pay service provider
      </span>
    </div>
  );
}
