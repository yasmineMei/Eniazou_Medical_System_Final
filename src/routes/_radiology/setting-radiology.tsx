import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_radiology/setting-radiology')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_radiology/setting-radiology"!</div>
}
