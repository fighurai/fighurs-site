import { canBuyIssue, type Issue } from '../data/issues'

type Props = {
  issue: Issue
  className?: string
  label?: string
}

/** Primary print checkout CTA — Stripe Payment Link when set. */
export function BuyPrintButton({ issue, className = 'btn btn--fill', label = 'Buy print' }: Props) {
  if (!canBuyIssue(issue)) {
    return (
      <span className={`${className} is-disabled`.trim()} aria-disabled="true" title="Checkout link coming soon">
        Coming soon
      </span>
    )
  }

  return (
    <a className={className} href={issue.buyUrl} target="_blank" rel="noreferrer">
      {label}
    </a>
  )
}
