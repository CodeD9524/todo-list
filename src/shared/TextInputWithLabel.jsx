import React from 'react'; 
import styled from 'styled-components'; 
const StyledInput = styled.input`
  padding: 0.5em; /* Small amount of padding */
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 0.5em; 
`;

function TextInputWithLabel({
  elementId,
  label,
  onChange,
  ref,
  value,
}) {
  return (
    <>
      <label htmlFor={elementId}>{label}</label>
      <StyledInput 
        type="text"
        id={elementId}
        ref={ref}
        value={value}
        onChange={onChange}
      />
    </>
  );
}

export default TextInputWithLabel;
