# Jaehyuk Park — Research Portfolio & Blog

Source for `https://isanbrandon.github.io/`.

The site combines a researcher portfolio with a public research notebook:

- About me
- Publications
- Experience
- Gallery
- CV
- Posts: research logs, paper reviews, deep paper analyses, protocols, policies, and experiment reports

## Run locally

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Validate before publishing

```bash
npm run check
```

The static site is written to `out/`.

## Publish with GitHub Pages

1. Create a public repository named exactly `IsanBrandon.github.io`.
2. Upload this repository and push to `main`.
3. In **Settings → Pages**, select **GitHub Actions** as the source.
4. The included workflow builds and deploys the static site.

## Add a post

Read [POSTING_GUIDE.md](POSTING_GUIDE.md). Drafts can start from the files in
`templates/`; publish only material cleared for public release.

## Public-content boundaries

Do not commit raw PerMo data, mirrored samples, checkpoints, private experiment
artifacts, absolute server paths, secrets, unpublished collaborator details,
unreviewed contact information, or media without permission and credits.

The website is the presentation layer. The separate research repository is the
canonical record for issues, frozen protocols, amendments, run metadata, and
result reports.
