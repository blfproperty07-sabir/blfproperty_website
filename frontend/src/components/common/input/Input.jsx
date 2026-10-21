import React, { forwardRef } from 'react';
import { getInputClassName } from './input';

const Input = forwardRef(({ className = '', invalid = false, ...props }, ref) => (
  <input
    ref={ref}
    className={getInputClassName({ className, invalid })}
    aria-invalid={invalid || undefined}
    {...props}
  />
));

Input.displayName = 'Input';

export default Input;
