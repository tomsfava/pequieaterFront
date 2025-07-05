import { useDeleteCommentMutation, useGetCommentsQuery } from '../../services/api'
import { Button, StyledLink } from '../../styles'
import deleteIcon from '../../assets/delete_16dp_FF0000_FILL0_wght400_GRAD0_opsz20.svg'

const CommentSection = ({ postId }: { postId: number }) => {
    const { data: comments, isLoading, isError } = useGetCommentsQuery(postId)
    const [deleteComment] = useDeleteCommentMutation()

    const handleDeleteComment = async (commentId: number) => {
        if (!window.confirm('Deseja deletar esse comentário?')) return
        try {
            await deleteComment(commentId).unwrap()
        } catch (err) {
            console.error('Erro ao deletar comentário', err)
        }
    }

    if (isLoading) return <p>Carregando comentários...</p>
    if (isError) return <p>Erro ao carregar comentários.</p>

    return (
        <div style={{ marginTop: '8px' }}>
            {comments && comments.length > 0 ? (
                comments.map((comment) => (
                    <div key={comment.id} style={{ marginBottom: '4px' }}>
                        <StyledLink
                            style={{ fontSize: '14px' }}
                            to={`/profile/${comment.author.id}`}
                        >
                            @{comment.author.username}
                        </StyledLink>{' '}
                        <span style={{ fontSize: '14px' }}>{comment.content}</span>
                        <span style={{ marginLeft: '4px', fontSize: '0.8em', color: '#888' }}>
                            ({new Date(comment.created_at).toLocaleString()})
                        </span>
                        <Button
                            size="small"
                            variant="danger"
                            onClick={() => handleDeleteComment(comment.id)}
                        >
                            <img src={deleteIcon} alt="Deletar" />
                        </Button>
                    </div>
                ))
            ) : (
                <p>Sem comentários ainda.</p>
            )}
        </div>
    )
}

export default CommentSection
