import styled from 'styled-components'

export const TitleSub = styled.div`
    display: flex;
    flex-direction: column;
    padding: 6px 12px;

    h1,
    p {
        margin: 2px;
        line-height: 1;
    }

    p {
        padding-left: 2px;
    }
`

export const Center = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

export const Header = styled.header`
    background-color: #ccffcc;
    padding: 0 6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`
