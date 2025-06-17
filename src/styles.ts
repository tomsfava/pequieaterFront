import styled, { createGlobalStyle } from 'styled-components'
import { Link } from 'react-router-dom'

export const GlobalStyle = createGlobalStyle`
    body {
        background-color: #E6F7FF;
    }

    h1 {
        font-size: 60px;
        color: #D9A600;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
    }

    h2 {
        font-size: 36px;
        color: #4B2E1E;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
    }
    h3 {
        font-size: 30px;
        color: #4B2E1E;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
    }

    .container {
        margin: 0 auto;
        max-width: 88vw;
    }

    textarea {
        resize: none;
    }

    .padding6 {
        padding: 0 6px;
    }
`

interface ButtonProps {
    variant?: 'primary' | 'danger'
    size?: 'small'
}

export const Button = styled.button<ButtonProps>`
    background-color: #6b8e23;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;

    &:hover {
        opacity: 0.9;
    }

    &:disabled {
        background-color: #a9a9a9;
        cursor: not-allowed;
    }

    ${(props) =>
        props.size === 'small' &&
        `
        padding: 4px 8px;
        font-size: 12px;
    `}

    ${(props) =>
        props.variant === 'danger' &&
        `
        background-color: #FFC0CB;
        border: 1px solid #FF0000;

        &:hover {
            opacity: 0.8;
        }
    `}
`

export const StyledLink = styled(Link)`
    text-decoration: none;
    color: #6b8e23;

    &:visited {
        color: #6b8e23;
    }

    &:hover {
        text-decoration: underline;
    }
`
