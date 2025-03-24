import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_medical-stock/article')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_medical-stock/article"!</div>
}
