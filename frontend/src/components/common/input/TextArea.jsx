import React, { forwardRef } from 'react';
import { getInputClassName } from './input';

const TextArea = forwardRef(({ className = '', invalid = false, ...props }, ref) => (
  <textarea
    ref={ref}
    className={getInputClassName({ className, invalid })}
    aria-invalid={invalid || undefined}
    {...props}
  />
));

TextArea.displayName = 'TextArea';

export default TextArea;
