/**
 * Tâches infirmières (checklist)

Liste des activités à réaliser : prélèvements, pansements, préparation pour examens.

Possibilité de cocher les tâches terminées.
 */

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_nurse/checklist')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_nurse/checklist"!</div>
}
