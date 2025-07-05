import styled from 'styled-components'

export const ProfileLayout = styled.div`
    display: flex;
    gap: 24px;
    align-items: flex-start;
    justify-content: center;
    flex-wrap: wrap;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 16px;
    }
`

export const MainColumn = styled.section`
    flex: 2;
    min-width: 300px;
    word-break: break-word;
    overflow-wrap: break-word;

    h2 {
        button {
            margin-left: 8px;
            vertical-align: middle;
        }
    }

    & > div,
    p {
        margin-bottom: 16px;
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

export const Avatar = styled.img`
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 50%;
    margin-bottom: 1rem;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
        width: 120px;
        height: 120px;
        margin: 0 auto 1rem;
        display: block;
    }
`
