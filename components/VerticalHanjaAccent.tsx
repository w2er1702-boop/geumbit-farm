type Props = {
  chars: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeMap = {
  sm: 'text-[80px]',
  md: 'text-[120px]',
  lg: 'text-[180px]',
};

export function VerticalHanjaAccent({ chars, size = 'md', className = '' }: Props) {
  return (
    <span
      aria-hidden="true"
      className={`vertical-hanja ${sizeMap[size]} leading-none ${className}`}
    >
      {chars}
    </span>
  );
}
