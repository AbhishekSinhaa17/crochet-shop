# Google OAuth Setup Guide for CrochetCraft

To enable "Login with Google", you need to perform some manual configuration in both the **Google Cloud Console** and the **Supabase Dashboard**.

## Phase 1: Google Cloud Console Setup

1.  **Create a New Project**:
    -   Go to the [Google Cloud Console](https://console.cloud.google.com/).
    -   Click the project dropdown in the top-left and select **New Project**.
    -   Give it a name like `CrochetCraft-Shop`.

2.  **Configure OAuth Consent Screen**:
    -   In the left sidebar, navigate to **APIs & Services > OAuth consent screen**.
    -   Select **External** and click **Create**.
    -   Provide the required information:
        -   **App name**: `CrochetCraft`
        -   **User support email**: Your email address.
        -   **Developer contact info**: Your email address.
    -   Continue through the "Scopes" and "Test Users" sections (you can leave them as-is for now).

3.  **Create Credentials**:
    -   In the left sidebar, navigate to **APIs & Services > Credentials**.
    -   Click **+ CREATE CREDENTIALS** at the top and select **OAuth client ID**.
    -   **Application type**: Web application.
    -   **Name**: `CrochetCraft Web Client`.
    -   **Authorized redirect URIs**: Add your Supabase Callback URL here later (see Phase 2).
    -   Click **Create**.
    -   **IMPORTANT**: Copy your **Client ID** and **Client Secret**. You'll need them in the next phase.

---

## Phase 2: Supabase Dashboard Setup

1.  **Enable Google Provider**:
    -   Go to your [Supabase Project Dashboard](https://supabase.com/dashboard/projects).
    -   In the left sidebar, navigate to **Authentication > Providers**.
    -   Find **Google** in the list and click to expand.
    -   Toggle **Enabled** to ON.

2.  **Enter Credentials**:
    -   Paste the **Client ID** and **Client Secret** you copied from the Google Cloud Console.

3.  **Get Callback URL**:
    -   Look for the **Callback URL (for OAuth)** in the Google provider settings on Supabase. It usually looks like: `https://[YOUR-PROJECT-ID].supabase.co/auth/v1/callback`.
    -   **Copy this URL**.

4.  **Finish Google Configuration**:
    -   Go back to the **Google Cloud Console > Credentials > CrochetCraft Web Client**.
    -   Under **Authorized redirect URIs**, paste the Callback URL you just copied from Supabase.
    -   Click **Save**.

---

## Phase 3: Verification

1.  Run your application locally (`npm run dev`).
2.  Navigate to `/auth/login` or `/auth/register`.
3.  Click the **Continue with Google** button.
4.  You should be redirected to the Google account selection screen.
5.  After choosing an account, you should be redirected back to the CrochetCraft home page.

> [!TIP]
> **New User Profiles**: The database is already configured to automatically create a profile for you in the `public.profiles` table whenever you sign in with Google for the first time!
