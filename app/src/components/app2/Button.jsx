import React from 'react';
import '../../style/button.css';

export default function Button ({
  children,
  css,
  click,
  theme = 'primary'}) {
  return (
    <button onClick={() => {
      click();
 }} className={`button ${theme ? theme : ''} ${css}`}> {children} </button>
  )
}


