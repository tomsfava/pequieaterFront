import styled from 'styled-components'
import { Outlet } from 'react-router-dom'

export const Header = styled.header`
    background-color: #ccffcc;
    padding: 0 6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);

    @media (max-width: 768px) {
        flex-direction: column;
    }
`

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

export const Nav = styled.nav`
    ul {
        display: flex;
        list-style: none;
        gap: 6px;
        align-items: center;
    }
`

export const SOutlet = styled(Outlet)`
    padding: 0 6px;
`
