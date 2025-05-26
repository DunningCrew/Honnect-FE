import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const FormGroup = styled.div`
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  font-weight: 400;
  color: #333;
`;

export const Input = styled.input`
  width: fit-content;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #fc6a03;
  }
`;

export const Button = styled.button`
  width: 100%;
  max-width: 200px;
  padding: 0.75rem;
  background-color: #fc6a03;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  display: block;
  margin: 0 auto;

  &:hover {
    background-color: #c95b0c;
  }

  &:active {
    background-color: #fc6a03;
  }
`;
