import styled from 'styled-components';

export const Container = styled.form`
  display: flex;
  flex-direction: column;
  width: 320px;
  margin: 60px auto;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

export const Title = styled.h2`
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #333;
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
  padding: 12px;
  font-size: 14px;
  margin-bottom: 14px;
  border: 1px solid #ccc;
  border-radius: 8px;

  &:focus {
    outline: none;
    border-color: #fc6a03;
  }
`;

export const Button = styled.button`
  margin-top: 10px;
  padding: 12px;
  font-size: 15px;
  font-weight: bold;
  background-color: #fc6a03;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c95b0c;
  }

  &:active {
    background-color: #fc6a03;
  }
`;
