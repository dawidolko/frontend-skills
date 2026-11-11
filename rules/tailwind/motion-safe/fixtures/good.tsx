export const NewBadge = ({ loading }: { loading: boolean }) => (
  <span className="relative flex size-3">
    <span className="absolute inline-flex size-full motion-safe:animate-ping rounded-full bg-sky-400 opacity-75" />
    <span className="animate-bounce motion-reduce:animate-none">New</span>
    <svg className="size-5 animate-spin" aria-hidden="true" />
    <span className={loading ? 'animate-pulse' : ''} />
  </span>
)
