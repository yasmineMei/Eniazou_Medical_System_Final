import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_medical-stock/inventaire')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_medical-stock/inventaire"!</div>
}
