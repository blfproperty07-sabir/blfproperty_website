import React, { forwardRef } from 'react';
import { getButtonClassName } from './button';

const Button = forwardRef(({
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  ...props
}, ref) => (
  <button
    ref={ref}
    type={type}
    disabled={disabled}
    className={getButtonClassName({ variant, size, className })}
    {...props}
  />
));

Button.displayName = 'Button';

export default Button;
