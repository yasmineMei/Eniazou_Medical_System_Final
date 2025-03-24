import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_medical-stock/approvisionnement')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_medical-stock/approvisionnement"!</div>
}
