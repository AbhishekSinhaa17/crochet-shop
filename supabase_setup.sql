# HOW TO FIX: Supabase Storage Permissions

If you received an error like `ERROR: 42501: must be owner of table objects` while running the SQL script, it's because your Supabase account doesn't have direct permission to modify the internal `storage` tables via SQL.

### Please follow these 3 simple steps in your Supabase Dashboard UI instead:

---

## Step 1: Create the Bucket
1.  Go to your [Supabase Dashboard](https://supabase.com/dashboard/projects).
2.  Click on **Storage** in the left sidebar (the bucket icon).
3.  Click **New Bucket** at the top.
4.  **Name**: `product-images`
5.  **Public Bucket**: Set this to **ON** (Enabled).
6.  Click **Save**.

---

## Step 2: Set Up Permissions (Policies)
1.  In the same **Storage** screen, find your new `product-images` bucket.
2.  Click on **Policies** in the left sidebar (under the Storage section).
3.  Find the `product-images` bucket in the list and click **New Policy**.
4.  Choose **Get started quickly** (using a template).
5.  Find the template: **"Give users access to all operations"** (or similar "Full access for authenticated users").
6.  Click **Use this template**.
7.  **Target Roles**: Select `authenticated`.
8.  Click **Review** and then **Save**.

---

## Step 3: Verify Public Access
1.  In the same **Policies** screen for `product-images`, click **New Policy** again.
2.  Choose **Get started quickly**.
3.  Find the template: **"Give public read access to all users"**.
4.  **Target Roles**: Select `anon`.
5.  Click **Review** and then **Save**.

---

### Why this is better:
By using the **Storage Dashboard**, you avoid the permission restriction in the SQL Editor. This will correctly set up your unique product images and the "Failed to upload" error should disappear immediately!
