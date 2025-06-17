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

    h2 {
        button {
            margin-left: 6px;
        }
    }
`

export const ProfileAside = styled.aside`
    flex: 1;
    min-width: 240px;
`

export const Post = styled.div`
    border: 1px solid #ccc;
    margin: 10px 0;
    padding: 10px;

    button {
        margin-left: 6px;
    }
`
export const SaveCancel = styled.div`
    margin-top: 2px;
    display: flex;
    align-items: center;
    gap: 6px;
`
