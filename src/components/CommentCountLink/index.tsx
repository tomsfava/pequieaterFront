import { useGetCommentsQuery } from '../../services/api'
import { ToggleCommentsLink } from './styles'

interface Props {
    postId: number
    showComments: boolean
    toggle: () => void
}

const CommentCountLink = ({ postId, showComments, toggle }: Props) => {
    const { data: comments, isLoading } = useGetCommentsQuery(postId)

    return (
        <ToggleCommentsLink onClick={toggle}>
            {showComments
                ? 'Esconder comentários'
                : isLoading
                  ? 'Carregando...'
                  : `Comentários (${comments?.length || 0})`}
        </ToggleCommentsLink>
    )
}

export default CommentCountLink
