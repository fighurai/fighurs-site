import { Link, Navigate, useParams } from 'react-router-dom'
import { BuyPrintButton } from '../components/BuyPrintButton'
import { getIssue, issues } from '../data/issues'
import '../styles/shop.css'

export function ShopProductPage() {
  const { slug = '' } = useParams()
  const issue = getIssue(slug)

  if (!issue) {
    return <Navigate to="/shop" replace />
  }

  const related = issues.filter((i) => i.slug !== issue.slug).slice(0, 5)

  return (
    <main className="shop shop--product page">
      <div className="shop__product">
        <Link className="shop__back eyebrow" to="/shop">
          ← All issues
        </Link>

        <div className="shop__product-grid">
          <div className="shop__product-cover" style={{ background: issue.accent }}>
            <img src={issue.cover} alt="" />
          </div>

          <div className="shop__product-body">
            <p className="eyebrow">
              Issue {issue.number} · {issue.year}
              {issue.month ? ` · ${issue.month}` : ''}
            </p>
            <h1 className="shop__product-title">{issue.title}</h1>
            <p className="shop__product-sub">{issue.subtitle}</p>
            <p className="shop__product-price">{issue.price}</p>
            <p className="shop__product-blurb">{issue.blurb}</p>

            <div className="shop__actions">
              <BuyPrintButton issue={issue} label="Buy print" />
              <Link className="btn" to={`/magazine/${issue.slug}`}>
                Flip digital
              </Link>
            </div>
          </div>
        </div>

        <section className="shop__related" aria-label="Related issues">
          <p className="eyebrow">Related issues</p>
          <div className="shop__related-rail">
            {related.map((r) => (
              <Link key={r.slug} to={`/shop/${r.slug}`} className="shop__related-item">
                <img src={r.cover} alt="" />
                <span>
                  Issue {r.number}
                  <strong>{r.price}</strong>
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
