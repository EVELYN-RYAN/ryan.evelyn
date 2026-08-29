import styles from "./Avatar.module.css";

interface AvatarProps {
  size: number;
  className?: string;
}

export function Avatar({ size, className }: AvatarProps) {
  return (
    <img
      src="/assets/img/RyanWebsiteImage.png"
      alt="Avatar"
      width={size}
      height={size}
      className={className ? `${styles.avatar} ${className}` : styles.avatar}
    />
  );
}
