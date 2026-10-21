export const getInputClassName = ({ className = '', invalid = false } = {}) => (
  ['input', invalid && 'input-error', className].filter(Boolean).join(' ')
);
