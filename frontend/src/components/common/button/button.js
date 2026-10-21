const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
  success: 'btn-success',
};

const sizes = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
  xl: 'btn-xl',
};

export const getButtonClassName = ({
  variant = 'primary',
  size = 'md',
  className = '',
} = {}) => {
  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] ?? sizes.md;

  return ['btn', variantClass, sizeClass, className].filter(Boolean).join(' ');
};
