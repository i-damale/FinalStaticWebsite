
README - Deploy instructions (layman steps)
=========================================

You have two parts: FRONTEND (static site) and BACKEND (API). Follow these simple steps.

1) Prepare repo and push all files to GitHub
-------------------------------------------
- Unzip the package.
- From the root folder run:
  git init
  git add -A
  git commit -m "Initial portfolio"
  git branch -M main
  # create a repo on GitHub, then:
  git remote add origin https://github.com/<your-username>/<repo-name>.git
  git push -u origin main

2) Host frontend on GitHub Pages (free)
---------------------------------------
- Go to your GitHub repo → Settings → Pages.
- Branch: main, Folder: / (root). Save.
- Your site will be at: https://<your-username>.github.io/<repo-name>/

3) Deploy backend on Render (free)
----------------------------------
- Go to https://render.com and sign up (connect your GitHub).
- Click "New" -> "Web Service".
- Select the repo and set the root to /backend.
- Build Command: leave empty or use: npm install
- Start Command: node server.js
- In the Render dashboard, find Environment → Add Environment Variables:
    MONGODB_URI  => mongodb+srv://somnath:YOUR_PASSWORD@cluster0.abcd1.mongodb.net/?retryWrites=true&w=majority
    MONGODB_DB   => portfolio
    SMTP_HOST    => smtp.gmail.com
    SMTP_PORT    => 587
    SMTP_USER    => yourgmail@gmail.com
    SMTP_PASS    => <GMAIL_APP_PASSWORD>
    NOTIFY_EMAIL => yourgmail@gmail.com
  NOTE: For Gmail, create an App Password at https://myaccount.google.com/apppasswords and use it as SMTP_PASS.

- Create the web service. After a minute it will show a live URL like:
    https://your-app-name.onrender.com

4) Connect frontend to backend
------------------------------
- Open frontend/assets/js/main.js and set:
    const API_BASE = "https://your-app-name.onrender.com";
- Commit & push this change to GitHub (git add, commit, push). GitHub Pages will update automatically.

5) Test
-------
- Open your static site URL and submit the contact form.
- Check your MongoDB Atlas -> Database -> messages collection to see saved messages.
- Check your email (NOTIFY_EMAIL) for alerts on new messages.

Security notes
--------------
- Do NOT commit real .env with secrets to GitHub.
- Use Render environment variables to keep secrets safe.
- If you prefer not to receive emails, remove SMTP_* env vars or leave NOTIFY_EMAIL empty.

If you'd like, I can also prepare a GitHub Actions workflow or convert backend to a serverless function (Vercel) — tell me which provider you prefer.
