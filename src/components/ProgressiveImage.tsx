import { useState, useCallback } from "react";

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}

/**
 * Drop-in `<img>` replacement that shows a warm skeleton shimmer
 * until the image finishes loading, then crossfades smoothly.
 *
 * No wrapper div — the shimmer is applied as a CSS background
 * on the img element itself, so layout/positioning is preserved.
 */
export function ProgressiveImage({
  src,
  alt,
  className = "",
  loading = "lazy",
}: ProgressiveImageProps) {
  const [loaded, setLoaded] = useState(false);

  const handleLoad = useCallback(() => setLoaded(true), []);

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      onLoad={handleLoad}
      className={`${className} ${loaded ? "" : "skeleton-shimmer"}`}
      style={loaded ? undefined : { objectFit: undefined }}
    />
  );
}
