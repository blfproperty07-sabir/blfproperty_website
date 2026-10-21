import React from 'react';
import { getCardClassName } from './card';

const Card = ({ as: Component = 'div', className = '', ...props }) => (
  <Component
    className={getCardClassName(className)}
    {...props}
  />
);

export default Card;
