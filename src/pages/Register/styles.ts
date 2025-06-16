import styled from 'styled-components'

export const FormRegister = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
`

export const Field = styled.div`
    display: flex;
    flex-direcion: column;

    label {
        margin-bottom: 4px;
        font-weight: bold;
    }

    input,
    textarea {
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 16px;

        &:focus {
            outline: none;
            border-color: #6b8e23;
            box-shadow: 0 0 0 2px rgba(107, 142, 35, 0.2);
        }
    }
`

export const FormFooter = styled.p`
    margin-top: 1.5rem;
    font-size: 14px;
    text-align: center;
`
