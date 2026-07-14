type NotFoundScreenProps = {
  requestedPath: string
  onOpenCatalogue: () => void
  onOpenHome: () => void
}

export function NotFoundScreen({ requestedPath, onOpenCatalogue, onOpenHome }: NotFoundScreenProps) {
  return (
    <main className="not-found-page">
      <p className="eyebrow"><span /> ROUTE NOT FOUND</p>
      <strong className="not-found-code">404</strong>
      <h1 data-route-heading tabIndex={-1}>This page is outside the map.</h1>
      <p>The route <code>#{requestedPath}</code> does not match an available chapter or lesson.</p>
      <div>
        <button className="primary-action" type="button" onClick={onOpenCatalogue}>Browse sorting lessons <span aria-hidden="true">→</span></button>
        <button className="not-found-home" type="button" onClick={onOpenHome}>Return home</button>
      </div>
    </main>
  )
}
