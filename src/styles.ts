import { createGlobalStyle } from 'styled-components'

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
        font-size: 32px;
        color: #4B2E1E;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
    }

    .container {
        margin: 0 auto;
        max-width: 88vw;
    }
`
