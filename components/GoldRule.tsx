type Props = {
  variant?: 'fade' | 'solid';
  className?: string;
};

export function GoldRule({ variant = 'fade', className = '' }: Props) {
  return (
    <div
      role="separator"
      aria-hidden="true"
      className={`${variant === 'solid' ? 'gold-rule-solid' : 'gold-rule'} ${className}`}
    />
  );
}
