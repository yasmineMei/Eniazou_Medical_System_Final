import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_medical-stock/dashboard-stock')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_medical-stock/dashboard-stock"!</div>
}
