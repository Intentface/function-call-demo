This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). This version uses Next.js 15 which uses React 19 which isn't added to peer dependencies by many existing libraries so note that you need to add the `--force` to when installing packages.

## Getting Started

Copy `.env.example` to `.env` file. You need `OPENAI_API_KEY` to run this example.

You can also install Google Vertex Provider `npm i @ai-sdk/google-vertex --force`, read documentation here:
https://sdk.vercel.ai/providers/ai-sdk-providers/google-vertex

Install dependencies:
```bash
npm install --force
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.