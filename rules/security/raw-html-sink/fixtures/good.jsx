import DOMPurify from 'dompurify'

export function Comment({ comment, bio, schema }) {
  const el = document.getElementById('preview')
  el.textContent = comment.body
  el.innerHTML = ''
  el.innerHTML = '<p class="empty">No comments</p>'
  // el.innerHTML = comment.body was replaced above
  return (
    <>
      <div className="bio" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(bio) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <p>{comment.body}</p>
    </>
  )
}
