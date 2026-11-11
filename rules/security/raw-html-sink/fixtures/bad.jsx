export function Comment({ comment, bio }) {
  const el = document.getElementById('preview')
  el.innerHTML = comment.body
  el.insertAdjacentHTML('beforeend', `<p>${bio}</p>`)
  return <div className="bio" dangerouslySetInnerHTML={{ __html: bio }} />
}
