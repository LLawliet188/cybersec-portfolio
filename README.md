# Manas Ranjan Rao - Cybersecurity Portfolio

Modern React portfolio for Manas Ranjan Rao, a BSc Computer Science student at IUBH Bad Honnef with a focus on cybersecurity, secure web applications, ethical hacking labs, and SOC-style tooling.

## Profile

- Name: Manas Ranjan Rao
- GitHub: [LLawliet188](https://github.com/LLawliet188)
- LinkedIn: [manas-ranjan-rao](https://www.linkedin.com/in/manas-ranjan-rao)
- Email: [manasranjanrao188@gmail.com](mailto:manasranjanrao188@gmail.com)
- Degree: BSc Computer Science, IUBH Bad Honnef
- Matriculation No.: 92017693

## Tech Stack

- React + Vite
- TypeScript
- TailwindCSS
- Framer Motion
- OGL WebGL effects
- Lucide React icons

## Project Structure

```text
src/
  components/
    common/      Reusable UI pieces such as buttons and section headings
    effects/     WebGL, texture, and scroll effects
    layout/      Site-level layout such as the navbar
    social/      Custom social profile icons
  content/       All public profile copy, links, skills, projects, and education data
  hooks/         Shared React hooks for scroll and reveal behavior
  sections/      Page sections in display order
  utils/         Animation presets and small helpers
```

## Getting Started

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://127.0.0.1:5173/
```

## Build

```bash
npm run build
```

The production bundle is generated in `dist/`, which is intentionally ignored by Git.

## Editing Content

Most personal details, project descriptions, social links, skill lists, and education information live in:

```text
src/content/siteContent.ts
```

Update that file first when changing profile copy or links.

## GitHub Push

```bash
git init
git add .
git commit -m "Initial portfolio website"
git branch -M main
git remote add origin https://github.com/LLawliet188/manas-ranjan-rao-cybersecurity-portfolio.git
git push -u origin main
```
