import styled from 'styled-components'

export const FormPost = styled.form`
    button {
        display: block;
    }
`

export const Post = styled.div`
    border: 1px solid #ccc;
    margin: 10px 0;
    padding: 10px;

    button {
        margin-left: 6px;
    }
`

export const PostImage = styled.img`
    max-width: 100%;
    height: auto;
    margin-top: 10px;
`

export const ToggleCommentsLink = styled.button`
    background: none;
    border: none;
    color: #1a73e8;
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
    font-size: 0.9em;

    &:hover {
        color: #0c47b7;
    }
`
