import React from 'react';
import '../style/app1/button.css';

const Button = ({children, css, click, theme = 'primary'}) => {

  return (
    <button onClick={() => {
      click();
 }} className={`button ${theme ? theme : ''} ${css}`}> {children} </button>
  )
}
export default Button
