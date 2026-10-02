# My Portfolio Website

Website at https://victorwinberg.github.io.

## Run locally

From the project root:

```bash
npx serve .
```

Then open http://localhost:3000 in your browser.

## Projects page

The projects page reads from `data/projects.json`. Each entry has:

```json
{
  "name": "qr-hunt",
  "description": "An app to hunt QR codes",
  "url": "https://qr.codies.se",
  "repo": "https://github.com/VictorWinberg/qr-hunt",
  "language": "Vue",
  "hide": true
}
```

`url` is the live site (leave empty if none). Set `hide` to `true` to keep a project in the file but hide it from the page. Projects are sorted by last updated on GitHub.
