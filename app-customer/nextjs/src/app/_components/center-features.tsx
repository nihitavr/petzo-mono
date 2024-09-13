import Image from "next/image";

import type { CENTER_FEATURES_TYPE } from "@petzo/constants";
import { CENTER_FEATURES_CONFIG } from "@petzo/constants";
import { cn } from "@petzo/ui/lib/utils";

const Features = ({
  features,
  className,
}: {
  features: CENTER_FEATURES_TYPE[] | null;
  className?: string;
}) => {
  features = features ? [...features] : [];

  if (!features?.length) return null;
  if (features.length === 1) {
    return (
      <div className="inline-flex items-center gap-1 text-2sm">
        <Image
          width={16}
          height={16}
          src={CENTER_FEATURES_CONFIG[features[0]!].icon}
          alt={"center feature " + features[0]}
        />
        <span className="whitespace-nowrap">
          {CENTER_FEATURES_CONFIG[features[0]!].name}
        </span>
      </div>
    );
  }

  // const lastFeature = features.pop()!;

  const featuresComp = features.map((feature, idx) => (
    <div key={feature} className="inline-flex items-center gap-1 text-2sm">
      <Image
        width={16}
        height={16}
        src={CENTER_FEATURES_CONFIG[feature].icon}
        alt={"center feature " + feature}
      />
      <span className="whitespace-nowrap">
        {CENTER_FEATURES_CONFIG[feature].name}
        {features.length - 1 !== idx && ","}{" "}
      </span>
    </div>
  ));

  return (
    <div className={cn("mt-1 flex flex-wrap items-center gap-1", className)}>
      {featuresComp}
    </div>
  );
};

export default Features;
