import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
};

export default function RecipeImage({
  src,
  alt,
  className,
  placeholderClassName,
}: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        aria-label={`Image unavailable for ${alt}`}
        className={placeholderClassName}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
