export const getCardClassName = (className = '') => (
  ['card', className].filter(Boolean).join(' ')
);
