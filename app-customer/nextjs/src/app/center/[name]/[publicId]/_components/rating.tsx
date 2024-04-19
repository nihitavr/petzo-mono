import { FaStar, FaStarHalf } from "react-icons/fa";

export default function Rating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-1">
        <span className="font-semibold">{rating}</span>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => {
            if (star - rating > 0.8) {
              return;
            } else if (star - rating > 0.3) {
              return (
                <FaStarHalf
                  key={star}
                  className="h-3.5 w-3.5 text-yellow-600"
                />
              );
            } else {
              return (
                <FaStar key={star} className="h-3.5 w-3.5 text-yellow-600" />
              );
            }
          })}
        </div>
      </div>
      <span className="line-clamp-1 text-xs font-semibold">
        (Google Rating)
      </span>
    </div>
  );
}
