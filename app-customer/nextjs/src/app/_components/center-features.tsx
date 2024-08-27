import Image from "next/image";

import type { CENTER_FEATURES_TYPE } from "@petzo/constants";
import { CENTER_FEATURES_CONFIG } from "@petzo/constants";

const Features = ({
  features,
}: {
  features: CENTER_FEATURES_TYPE[] | null;
}) => {
  features = features ? [...features] : [];

  if (!features?.length) return null;
  if (features.length === 1) {
    return (
      <div className="inline-flex items-center gap-1 text-2sm">
        <span>Includes</span>
        <Image
          width={16}
          height={16}
          src={CENTER_FEATURES_CONFIG[features[0]!].icon}
          alt={"center feature " + features[0]}
        />
        <span>{CENTER_FEATURES_CONFIG[features[0]!].name}</span>
      </div>
    );
  }

  const lastFeature = features.pop()!;

  const featuresComp = features.map((feature, idx) => (
    <div key={feature} className="inline-flex items-center gap-1 text-2sm">
      {idx == 0 && <span>Includes</span>}
      <Image
        width={16}
        height={16}
        src={CENTER_FEATURES_CONFIG[feature].icon}
        alt={"center feature " + feature}
      />
      <span>{CENTER_FEATURES_CONFIG[feature].name}, </span>
    </div>
  ));

  featuresComp.push(
    <div key={lastFeature} className="inline-flex items-center gap-1 text-2sm">
      <span>&</span>
      <Image
        width={16}
        height={16}
        src={CENTER_FEATURES_CONFIG[lastFeature].icon}
        alt={"center feature " + lastFeature}
      />
      <span>{CENTER_FEATURES_CONFIG[lastFeature].name}</span>
    </div>,
  );

  return <div className="flex items-center gap-1">{featuresComp}</div>;
};

export default Features;
