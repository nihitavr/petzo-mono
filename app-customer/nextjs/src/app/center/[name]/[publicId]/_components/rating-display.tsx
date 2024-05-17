import { FaRegStar, FaStar } from "react-icons/fa";

export default function Rating({
  rating,
  withValue = true,
}: {
  rating: number;
  withValue?: boolean;
}) {
  rating = +rating.toFixed(1);

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-1">
        {withValue && <span className="font-semibold">{rating}</span>}
        <div className="-mt-0.5 flex items-center gap-[1px]">
          {[1, 2, 3, 4, 5].map((star) => {
            if (rating - star >= 0)
              return (
                <div className="relative" key={star}>
                  <FaStar className="size-3.5 text-yellow-600" />
                  <FaRegStar
                    strokeWidth={10}
                    className="absolute -left-[0.04rem] -top-[0.03rem] size-[0.93rem] text-yellow-600"
                  />
                </div>
              );

            const width =
              rating - star > -1 ? `${(rating - star + 1) * 100}` : `0`;

            return (
              <div className="relative" key={star}>
                <div
                  style={{ width: `${width}%` }}
                  className="size-3.5 overflow-hidden"
                >
                  <FaStar className="size-3.5 text-yellow-600" />
                </div>
                <FaRegStar className="absolute -left-[0.04rem] -top-[0.03rem] size-[0.93rem] text-yellow-600/50" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
