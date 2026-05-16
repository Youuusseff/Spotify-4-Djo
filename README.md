# 🎵 Djofy — Spotify Clone

> A full-featured music streaming web app built with Next.js 15, Supabase, and Stripe.

🔗 **Live Demo:** [djofy.vercel.app](https://djofy.vercel.app)

---

## ✨ Features

- 🎧 **Music Streaming** — Upload and stream songs directly in the browser
- 🔐 **Authentication** — Secure sign-up / sign-in powered by Supabase Auth
- 💳 **Stripe Subscriptions** — Premium plan billing with Stripe integration
- ❤️ **Likes & Comments** — Like songs and leave threaded comments with up/down votes
- 🔔 **Notifications** — Real-time notifications for follows, likes, comments, and replies
- 👤 **User Profiles** — Public profiles with bio, avatar, follower/following counts
- 🌐 **Public & Private Songs** — Control who can discover your uploads
- 🔍 **Search** — Find songs and artists across the platform
- 📱 **Responsive Design** — Mobile-friendly UI built with Tailwind CSS

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Database & Auth | [Supabase](https://supabase.com) |
| Payments | [Stripe](https://stripe.com) |
| Styling | Tailwind CSS v4 |
| UI Components | Radix UI, Lucide React, shadcn/ui |
| State Management | Zustand |
| Forms | React Hook Form |
| Audio Playback | use-sound |
| Toasts | React Hot Toast |
| Deployment | [Vercel](https://vercel.com) |

---

## 📁 Project Structure

```
├── app/              # Next.js App Router pages & API routes
├── actions/          # Server actions
├── components/       # Reusable UI components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions & helpers
├── libs/             # Third-party library wrappers (Supabase, Stripe)
├── providers/        # React context providers
├── supabase/         # Supabase config & migrations
├── public/           # Static assets
├── types.ts          # Shared TypeScript interfaces
└── types_db.ts       # Auto-generated Supabase DB types
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Stripe](https://stripe.com) account

### 1. Clone the repository

```bash
git clone https://github.com/Youuusseff/Spotify-4-Djo.git
cd Spotify-4-Djo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file at the root and add the following:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### 4. Set up Supabase

Run the migrations located in the `supabase/` folder using the Supabase CLI:

```bash
npx supabase db push
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

---

## 🌐 Deployment

The app is deployed on **Vercel**. To deploy your own instance:

1. Push your code to GitHub.
2. Import the repo into [Vercel](https://vercel.com/new).
3. Add all environment variables from `.env.local` to the Vercel project settings.
4. Deploy!

For Stripe webhooks, set your webhook endpoint to:
```
https://your-domain.vercel.app/api/webhooks
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">Made with ❤️ by <a href="https://github.com/Youuusseff">Youuusseff</a></p>
