# Posting guide

The first version uses static Next.js pages so every public post is explicit,
reviewable, and versioned in Git.

## Recommended categories

| Category | Use it for |
| --- | --- |
| Research Log | Dated progress, decisions, failures, and next actions |
| Paper Review | Problem, method, evidence, and limitations |
| Paper Analysis | Intuition, equations, implementation, assumptions, and research connections |
| Protocol | Hypotheses, splits, metrics, and decision gates fixed before results |
| Policy | Data, reproducibility, versioning, and disclosure rules |
| Experiment Report | Environment, results, statistics, failures, and conclusion |

## Publish a new page

1. Copy `app/posts/poc-0/page.tsx` to `app/posts/<slug>/page.tsx`.
2. Replace the title, metadata, table of contents, and article body.
3. Add the new post card to `app/posts/page.tsx` and the recent-posts block in `app/page.tsx`.
4. Run `npm run check`.
5. Commit the post together with any cited public artifacts.

## Required metadata

- type and status
- project and version
- published and updated dates
- related issue, code, or paper when public
- visibility and language
- topic tags

Use one of these status labels: `Idea`, `Draft`, `Planned Protocol`,
`Protocol Frozen`, `Running`, `Complete`, `Negative Result`, or `Superseded`.

Never label a protocol as frozen until its commit or tag is immutable. Never
write planned thresholds or qualitative expectations as empirical results.
