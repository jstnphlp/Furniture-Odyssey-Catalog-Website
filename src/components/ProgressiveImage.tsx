import { useState, useCallback } from "react";

type ImageFit = "cover" | "contain";

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  fit?: ImageFit;
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
  fit,
}: ProgressiveImageProps) {
  const [loaded, setLoaded] = useState(false);

  const handleLoad = useCallback(() => setLoaded(true), []);
  const fitStyle = fit
    ? { objectFit: fit, objectPosition: "center" }
    : undefined;

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      onLoad={handleLoad}
      className={`${className} ${loaded ? "" : "skeleton-shimmer"}`}
      style={fitStyle}
    />
  );
}
