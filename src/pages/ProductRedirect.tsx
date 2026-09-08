import { Navigate, useParams } from 'react-router-dom'
import { getIssueByProductSlug } from '../data/issues'

/** Legacy WooCommerce `/product/:wpSlug` → `/shop/:slug` */
export function ProductRedirect() {
  const { wpSlug = '' } = useParams()
  const issue = getIssueByProductSlug(wpSlug)
  if (!issue) return <Navigate to="/shop" replace />
  return <Navigate to={`/shop/${issue.slug}`} replace />
}
