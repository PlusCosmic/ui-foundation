import { type CSSProperties, useState } from "react";
import { useUiCopy } from "../copy/UiCopyProvider";

/** A person's picture, or their initials on the fill colour when there's none or it fails to load. */
export function Avatar({
  name,
  src,
  size = 28,
  color,
}: {
  name?: string | null;
  src?: string | null;
  size?: number;
  /** Background behind the initials; the fill colour when unset. Text stays white, so pass a mid-tone. */
  color?: string;
}) {
  const copy = useUiCopy().avatar;
  const [imageFailed, setImageFailed] = useState(false);
  const initials = (name ?? copy.defaultName)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  return (
    <span
      className="ui-avatar"
      style={{ "--size": `${size}px`, background: color } as CSSProperties}
    >
      {src && !imageFailed ? (
        <img
          src={src}
          alt={name ?? copy.alt}
          onError={() => setImageFailed(true)}
        />
      ) : (
        initials || copy.defaultInitial
      )}
    </span>
  );
}
