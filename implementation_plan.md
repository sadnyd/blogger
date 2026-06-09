# Blog Platform Design Review & Implementation Plan

Your Phase 1 MVP design is incredibly solid. It strikes a great balance between moving fast (Next.js + Supabase) and building a scalable foundation. Using Server Actions and Markdown for content are excellent choices for modern web development.

To ensure the architecture remains **loosely coupled** and can **scale progressively** into Phase 2 and 3, I have reviewed your LLD and suggested a few critical additions and refinements.

## User Review Required

Please review the following architectural tweaks. Once you approve, we can begin scaffolding the project.

> [!IMPORTANT]  
> **Supabase Row Level Security (RLS)**  
> Your database schema is clean, but because we are using Supabase, we MUST implement Row Level Security (RLS) policies. Without RLS, anyone with your Supabase Anon key could read or modify your database. We need to define policies that state:
> - Anyone can read `published` posts.
> - Only authenticated admins can insert/update/delete posts and read `draft` posts.

> [!TIP]  
> **Markdown vs. MDX**  
> You mentioned storing content as Markdown. I highly recommend using **MDX** (Markdown + JSX) from day one. It's fully backward compatible with standard Markdown, but it allows you to embed interactive React components (like a custom code playground, interactive charts, or custom tweet embeds) directly in your blog posts later in Phase 2 or 3 without rewriting your parser.

## Recommended Architectural Tweaks

### 1. Database Refinements

While your tables are great, we need to add a few things for performance and security:

#### [MODIFY] `schema.sql` (Proposed Additions)
```sql
-- 1. Enable RLS on all tables
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- (etc for other tables)

-- 2. Add crucial indexes for performance
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_author_id ON posts(author_id);

-- 3. RLS Policy Example for Posts
CREATE POLICY "Public profiles are viewable by everyone."
  ON posts FOR SELECT
  USING ( status = 'published' );

CREATE POLICY "Users can manage their own posts."
  ON posts FOR ALL
  USING ( auth.uid() = author_id );
```

### 2. Folder Structure Enhancements

To keep the system strictly loosely coupled, we should enforce a separation of concerns in the directory structure.

#### [NEW] Additional App Router Files
```text
src/
├── app/
│   ├── layout.tsx         # Global layout (Providers, Fonts)
│   ├── error.tsx          # Global error boundary
│   ├── loading.tsx        # Global loading state
│   ├── admin/
│   │   ├── layout.tsx     # Admin-specific layout (Dashboard Sidebar, Auth Guard)
```

### 3. Loose Coupling Strategies

To ensure you can swap out technologies later (e.g., moving from Supabase Storage to AWS S3, or Supabase Auth to Auth.js):

- **Dependency Inversion in `lib/`**: Ensure your `actions/posts.ts` never calls `supabase` directly. Instead, it should call functions exported from `lib/db/`. This way, if you change databases, you only update `lib/db/`, and your Next.js Server Actions remain untouched.
- **Storage Abstraction**: When uploading a cover image, create a wrapper function like `uploadImage(file)`. Today, it uses Supabase Storage. Tomorrow, it could use S3.

## Open Questions

1. **Styling**: Do you have a preference for styling? (e.g., Tailwind CSS, Vanilla CSS, CSS Modules). Given your desire to keep it simple but beautiful, Tailwind is usually the fastest for Next.js, but I can use plain CSS if you prefer.
2. **Admin Users**: For the MVP, will you be the *only* admin, or do we need to build an invitation system for multiple authors right away? (If just you, we can hardcode your email as the allowed admin during registration).
3. **Local Development**: Do you want to set up the Supabase CLI for local database development, or just connect directly to a remote Supabase project for the MVP?

## Verification Plan

Once approved, the execution will follow these steps:
1. Initialize Next.js project with the chosen styling method.
2. Scaffold the folder structure and setup Next.js App Router layouts.
3. Provide the exact SQL migration scripts (with RLS and indexes) for you to run in Supabase.
4. Implement the authentication flow and route protection.
5. Build out the Admin dashboard and Markdown/MDX editor.
6. Build out the public blog views.
