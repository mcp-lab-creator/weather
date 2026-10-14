# स्मार्ट पचेरी · Smart Pacheri

A small MVP for **Pacheri Gram Panchayat, Jhunjhunu, Rajasthan**. Villagers can, from a phone and without logging in:

- 📝 raise a complaint (with an optional photo) and get a tracking ID like `PCH-0001`
- 🔍 check complaint status by tracking ID or mobile number
- 🏛️ read government scheme info (benefit, eligibility, documents)
- 📢 read Panchayat notices and Gram Sabha meeting dates

The Sarpanch team uses `/admin` (one password) to manage complaints, schemes and notices.
Hindi by default, English toggle in the header.

**Stack:** Next.js 15 (App Router, TypeScript) · Tailwind CSS 4 · Supabase (Postgres + Storage) · Vercel.
**Cost:** everything runs on free plans (Supabase Free, Vercel Hobby, GitHub).

---

## Setup (about 20 minutes)

### 1. Create the Supabase project
1. Sign up at <https://supabase.com> and click **New project** (free plan). Choose a region close to India (e.g. *Mumbai / ap-south-1*), and save the database password.
2. Wait for the project to finish creating.

### 2. Run the SQL
1. In Supabase open **SQL Editor → New query**.
2. Paste the whole contents of [`supabase/schema.sql`](supabase/schema.sql) and click **Run**. **Run it only once** (running it again duplicates the seed schemes).

This creates the `complaints`, `schemes` and `notices` tables, the tracking-ID generator, the `complaint-photos` storage bucket, 6 seed schemes (PM-KISAN, Ayushman Bharat, Rajasthan pension, PMAY-G, Ujjwala, MGNREGA/VB-G RAM G) and one welcome notice.

### 3. Get your keys
In Supabase go to **Project Settings → API** and note:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **service_role** key (shown under *Legacy API keys*, or the new **Secret key** under *API Keys*) → `SUPABASE_SERVICE_ROLE_KEY`

> ⚠️ The service key gives full database access. It is used only on the server. Never put it in a `NEXT_PUBLIC_` variable and never share it.

### 4. Environment variables

| Variable | Meaning |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase server key (secret) |
| `ADMIN_PASSWORD` | The single password for `/admin` – make it long |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number with country code, digits only, e.g. `919876543210`. Empty = button hidden |

For local use: `cp .env.example .env.local`, fill it in, then:

```bash
npm install
npm run dev        # http://localhost:3000
```

### 5. Deploy to Vercel
1. Push this repository to GitHub.
2. At <https://vercel.com> choose **Add New → Project**, import the repo (framework: Next.js, auto-detected).
3. Under **Environment Variables** add the four variables above.
4. Click **Deploy**. Share the `https://….vercel.app` link with villagers.

If you change variables later, redeploy (Deployments → ⋯ → Redeploy).

### 6. First check
- Open the link → raise a test complaint (with a photo) → note the `PCH-xxxx` ID.
- Open `/admin`, log in, find the complaint, set status *In Progress* and add a remark.
- Open **Check Status** with the ID and confirm the update shows.
- Delete or edit the sample notice in **/admin/notices**.

---

## How it works
- All database and storage access happens **on the server** (`app/api`, server components, server actions) with the service-role key. Row Level Security is on with no public policies, so the public key can't read or write anything.
- Admin login compares the password to `ADMIN_PASSWORD` and sets a signed, HTTP-only cookie (7 days). Every admin action re-checks it.
- Photos are shrunk on the phone to ≤1280px JPEG before upload (works on slow networks), stored in a public bucket with random file names, and shown only to the admin.
- Schemes and notices have Hindi (required) and English (optional) fields; if English is empty, Hindi is shown.

```
app/            pages: / /complaint /status /schemes /notices /admin(/schemes|/notices), api/complaints
components/     header, language toggle, complaint form, WhatsApp button
lib/            i18n.ts (all Hindi/English text), supabase.ts, admin-auth.ts
supabase/       schema.sql
```

To change wording or add a category, edit [`lib/i18n.ts`](lib/i18n.ts) (and the `category` check in `supabase/schema.sql` for a new category).

## Things to know (prototype limits)
- **Privacy:** Status search by tracking ID or mobile shows category, ward, an 80-character excerpt of the description, status and remarks – never the name or mobile. Sequential IDs are guessable, so don't put sensitive details in complaints. Photos are in a public bucket under unguessable URLs.
- **No spam protection / rate limiting** and no brute-force limit on the admin login. Use a long `ADMIN_PASSWORD`. Add Vercel's bot protection or a captcha if this goes beyond a trial.
- **Free tiers:** Supabase pauses free projects after ~1 week of inactivity (open the dashboard and click *Restore*). Vercel Hobby is for non-commercial use. Check both plans' current limits.
- **Scheme data** was written from public sources and amounts/rules change (e.g. pension amounts, MGNREGA → VB-G RAM G). Verify against official portals and edit from `/admin/schemes` before sharing widely.
- Complaints cannot be deleted from the admin screen; use the Supabase **Table Editor** if needed.

## Scripts
`npm run dev` · `npm run build` · `npm run lint` · `npm run typecheck`
