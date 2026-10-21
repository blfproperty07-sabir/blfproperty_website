import React, { forwardRef } from 'react';
import { getInputClassName } from './input';

const Select = forwardRef(({ className = '', invalid = false, ...props }, ref) => (
  <select
    ref={ref}
    className={getInputClassName({ className, invalid })}
    aria-invalid={invalid || undefined}
    {...props}
  />
));

Select.displayName = 'Select';

export default Select;
