import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_medical-stock/medical-stock')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_medical-stock/medical-stock"!</div>
}
