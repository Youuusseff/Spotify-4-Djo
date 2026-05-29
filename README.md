# 🎵 Djofy — Where Music Meets Community

> **Spotify meets Reddit.** Djofy is a social music streaming platform where you stream, upload, and discuss music with a community — because the best way to experience music is together.

🔗 **Live Demo:** [djofy.vercel.app](https://djofy.vercel.app)

---

## 🧠 Concept

Most streaming platforms are passive: you listen, you move on. **Djofy flips that.**

Can't find a track? **Upload it** — and make it available for the whole community forever.  
Found a hidden gem? **Share it**, and open a discussion thread so others can talk about it.  
Want to discover what people are listening to? **Follow users** whose taste you trust.

Djofy is built around the idea that music is social — every song is a conversation waiting to happen.

---

## ✨ Features

### 🎧 Streaming Mode *(Spotify-style)*
- Upload and stream songs directly in the browser
- Persistent audio player with playback controls
- Browse and search the community's music library
- Like songs and save them to your library

### 🗨️ Thread Mode *(Reddit-style)*
- Switch between **Stream mode** and **Thread mode** from the home page
- In Thread mode, clicking a song plays it **and** opens its dedicated thread page
- Each thread page shows:
  - The song's cover art, title, and the uploader's avatar & username
  - A Reddit-style discussion section with **upvotes / downvotes** on comments
  - **Nested replies** with real-time **notifications** for interactions
- Every song is both a track and a conversation

### 👤 Social Layer
- **Follow / Unfollow** users and build your musical network
- Public **user profiles** with bio, avatar, follower & following counts
- Notifications for new followers, replies, upvotes, and comments
- Discover new music through the people you follow

### 🔐 Auth & Platform
- Secure authentication powered by **Supabase Auth**
- **Stripe** subscription billing for premium plans
- Upload your own songs with cover art — public or private
- Fully **responsive** design for mobile and desktop

---

## 💳 Testing Stripe Subscriptions

The app runs in **Stripe test mode**, so no real money is charged. Use the following test card to go through the full subscription flow.

### Test Card Details

| Field | Value |
|---|---|
| Card number | `4242 4242 4242 4242` |
| Expiry date | Any future date (e.g. `12/34`) |
| CVC | Any 3 digits (e.g. `123`) |
| Name | Anything |
| Billing address | Anything |

### How to Subscribe

1. Go to [djofy.vercel.app](https://djofy.vercel.app) and **sign in** (or create an account).
2. Click the **Subscribe** button — it appears in the sidebar or when you try to access a premium feature.
3. The Stripe checkout page will open. Enter the test card details above.
4. Click **Subscribe** to confirm.
5. You'll be redirected back to your account page with **Premium** active.

### How to Cancel

1. Go to your **Account** page.
2. Click **Open customer portal**.
3. Select **Cancel subscription** in the Stripe portal.

> These are test credentials only. Switch Stripe to **Live mode** and replace the API keys in your environment variables before going to production.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Database & Auth | [Supabase](https://supabase.com) (PostgreSQL + Storage) |
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
│   ├── (site)/       # Main app pages (home, search, thread...)
│   └── api/          # API routes (webhooks, etc.)
├── actions/          # Server actions (upload, vote, follow...)
├── components/       # Reusable UI components
│   ├── player/       # Audio player components
│   ├── thread/       # Thread & comment components
│   └── social/       # Follow, notifications, profile components
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

This project is open source and available under the [MIT License](./LICENSE).

---

Made with ❤️ by [Youuusseff](https://github.com/Youuusseff)
