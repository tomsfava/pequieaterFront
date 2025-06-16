import styled from 'styled-components'

export const ProfileLayout = styled.div`
    display: flex;
    gap: 24px;
    align-items: flex-start;
    justify-content: center;
    flex-wrap: wrap;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`

export const MainColumn = styled.section`
    flex: 2;
    min-width: 300px;
    word-break: break-word;
    overflow-wrap: break-word;
`

export const ProfileAside = styled.aside`
    flex: 1;
    min-width: 240px;
`
