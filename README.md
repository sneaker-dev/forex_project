# ForexPro Dashboard UI

This is a [Next.js](https://nextjs.org) frontend project for the ForexPro trading dashboard experience.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Admin CRM (staff)

A separate **Admin CRM** shell is available at **`/admin`** (also linked from the login page as *Admin CRM (staff)*). It includes a full **operations dataset** (users, trades, treasury, KYC queue, support tickets, copy masters/links, IB tree, prop challenges, etc.), **charts** on the overview, **interactive workflows** (approve KYC, resolve tickets, process deposits/withdrawals, pause copy links, change client status), and **local persistence** (`localStorage`) so changes feel like a real console. Use **⋮ → Reset to baseline dataset** in the header to restore factory data.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
