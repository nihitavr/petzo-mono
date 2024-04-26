import { FaRegStar, FaStar } from "react-icons/fa";

export default function Rating({
  rating,
  withValue = true,
}: {
  rating: number;
  withValue?: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-1">
        {withValue && (
          <span className="font-semibold">{rating.toFixed(1)}</span>
        )}
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => {
            if (rating - star >= 0)
              return (
                <div className="relative" key={star}>
                  <FaStar className="h-3.5 w-3.5 text-yellow-600" />
                  <FaRegStar className="absolute left-0 top-0 h-[0.93rem] w-[0.93rem] text-yellow-600" />
                </div>
              );

            const width =
              rating - star > -1 ? `${(rating - star + 1) * 100}%` : `0%`;

            return (
              <div className="relative" key={star}>
                <div style={{ width }} className="h-3.5 w-3.5 overflow-hidden">
                  <FaStar className="h-3.5 w-3.5 text-yellow-600" />
                </div>
                <FaRegStar className="absolute left-0 top-0 h-[0.93rem] w-[0.93rem] text-yellow-600" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
