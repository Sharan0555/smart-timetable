# Google Sign-In setup (fix origin_mismatch)

Error **400: origin_mismatch** means the URL in your browser is not listed on your OAuth client.

## Steps

1. Open [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services** → **Credentials**.
2. Click your **OAuth 2.0 Client ID** (Web application) — the one ending in `...c3049.apps.googleusercontent.com`.
3. Under **Authorized JavaScript origins**, click **+ ADD URI** and add **every** origin you use (scheme + host + port, no path):

   | How you open the app | Add this origin |
   |----------------------|-----------------|
   | VS Code / Cursor Live Server (port 5500) | `http://127.0.0.1:5500` |
   | Same, alternate | `http://localhost:5500` |
   | `python -m http.server 8080` | `http://localhost:8080` |
   | Netlify deploy | `https://YOUR-SITE-NAME.netlify.app` |

4. Click **Save**. Wait 1–5 minutes for Google to apply changes.
5. Hard-refresh the login page (Cmd+Shift+R) and try **Continue with Google** again.

## Important

- Do **not** use `file:///...` — Google OAuth requires `http://` or `https://`.
- `http://localhost:5500` and `http://127.0.0.1:5500` are **different** origins — add both if you use either.
- The login page shows your current origin under the Google button; copy that value into the console.

## Authorized redirect URIs

For **Google Identity Services** (sign-in button only), you usually only need **JavaScript origins**. Redirect URIs are optional unless you use redirect-based OAuth.

If prompted, you can add:

- `http://localhost:8080`
- `https://YOUR-SITE-NAME.netlify.app`
