<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>TaskFlow README</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f6f8fa; min-height: 100vh; padding: 2rem 1rem; }
  .wrapper { max-width: 780px; margin: 0 auto; background: #fff; border: 1px solid #d0d7de; border-radius: 12px; overflow: hidden; }
  .topbar { background: #f6f8fa; border-bottom: 1px solid #d0d7de; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; }
  .topbar span { font-size: 13px; font-weight: 600; color: #57606a; }
  .copy-all { background: #2da44e; color: #fff; border: none; border-radius: 6px; padding: 6px 16px; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.15s; }
  .copy-all:hover { background: #2c974b; }
  .copy-all.copied { background: #6366f1; }
  .content { padding: 2rem 2.5rem; color: #1f2328; line-height: 1.7; }
  h1 { font-size: 1.75rem; font-weight: 800; border-bottom: 2px solid #d0d7de; padding-bottom: 0.5rem; margin-bottom: 0.75rem; }
  h2 { font-size: 1.2rem; font-weight: 700; border-bottom: 1px solid #d0d7de; padding-bottom: 0.4rem; margin: 2rem 0 0.75rem; }
  h3 { font-size: 1rem; font-weight: 700; margin: 1.5rem 0 0.5rem; }
  p { margin-bottom: 0.75rem; }
  ul { padding-left: 1.5rem; margin-bottom: 0.75rem; }
  li { margin-bottom: 0.3rem; font-size: 14px; }
  ol { padding-left: 1.5rem; margin-bottom: 0.75rem; }
  ol li { margin-bottom: 0.4rem; font-size: 14px; }
  strong { font-weight: 700; }
  a { color: #0969da; text-decoration: none; }
  a:hover { text-decoration: underline; }
  hr { border: none; border-top: 1px solid #d0d7de; margin: 1.75rem 0; }
  .code-block { position: relative; margin: 0.75rem 0; }
  pre { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 8px; padding: 1rem 1.25rem; font-family: 'SFMono-Regular', Consolas, monospace; font-size: 13px; line-height: 1.6; overflow-x: auto; white-space: pre; }
  code { font-family: 'SFMono-Regular', Consolas, monospace; font-size: 13px; background: #f6f8fa; padding: 2px 5px; border-radius: 4px; border: 1px solid #d0d7de; }
  pre code { background: none; border: none; padding: 0; }
  .copy-btn { position: absolute; top: 8px; right: 8px; background: #fff; border: 1px solid #d0d7de; border-radius: 6px; padding: 4px 10px; font-size: 11px; font-weight: 600; color: #57606a; cursor: pointer; transition: all 0.15s; }
  .copy-btn:hover { background: #f3f4f6; color: #1f2328; }
  .copy-btn.copied { background: #dafbe1; color: #1a7f37; border-color: #a8f0c6; }
  .live-links { display: flex; flex-direction: column; gap: 6px; margin: 0.5rem 0 1rem; }
  .live-links p { margin: 0; font-size: 14px; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="topbar">
    <span>📄 README.md</span>
    <button class="copy-all" onclick="copyAll(this)">Copy all</button>
  </div>
  <div class="content" id="rendered">

    <h1>TaskFlow - MERN Kanban Task Manager</h1>
    <p>A full stack task management app built with MongoDB, Express, React, and Node.js.</p>

    <h2>Live Site</h2>
    <div class="live-links">
      <p><strong>Frontend:</strong> <a href="#">https://taskflow-app.vercel.app</a></p>
      <p><strong>Backend:</strong> <a href="#">https://taskflow-api.onrender.com</a></p>
      <p><strong>Database:</strong> MongoDB Atlas</p>
    </div>

    <hr/>

    <h2>Features</h2>
    <ul>
      <li>Register, login, and manage your profile</li>
      <li>Create boards and organise tasks in a Kanban layout</li>
      <li>Drag and drop task cards across columns</li>
      <li>Assign tasks to teammates with role-based access</li>
      <li>Set priorities, deadlines, and labels on tasks</li>
      <li>Team management with Owner, Admin, and Member roles</li>
    </ul>

    <hr/>

    <h2>Run Locally</h2>

    <h3>Backend</h3>
    <div class="code-block">
      <pre><code>cd backend
npm install
cp .env.example .env</code></pre>
      <button class="copy-btn" onclick="copyBlock(this)">Copy</button>
    </div>

    <p>Fill in your <code>.env</code>:</p>
    <div class="code-block">
      <pre><code>PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=any_random_string
CLIENT_URL=http://localhost:5173</code></pre>
      <button class="copy-btn" onclick="copyBlock(this)">Copy</button>
    </div>

    <div class="code-block">
      <pre><code>npm run dev</code></pre>
      <button class="copy-btn" onclick="copyBlock(this)">Copy</button>
    </div>

    <h3>Frontend</h3>
    <div class="code-block">
      <pre><code>cd frontend
npm install
cp .env.example .env
npm run dev</code></pre>
      <button class="copy-btn" onclick="copyBlock(this)">Copy</button>
    </div>

    <p>Fill in your <code>.env</code>:</p>
    <div class="code-block">
      <pre><code>VITE_API_URL=http://localhost:5000/api</code></pre>
      <button class="copy-btn" onclick="copyBlock(this)">Copy</button>
    </div>

    <p>App runs at <strong>http://localhost:5173</strong></p>

    <hr/>

    <h2>Deploy to Vercel &amp; Render</h2>

    <h3>Backend (Render)</h3>
    <ol>
      <li>Go to <a href="https://render.com">https://render.com</a> and sign in with GitHub</li>
      <li>Click <strong>New → Web Service</strong></li>
      <li>Import your GitHub repository</li>
      <li>Set <strong>Root Directory</strong> to <code>backend</code></li>
      <li>Set <strong>Build Command</strong> to <code>npm install</code></li>
      <li>Set <strong>Start Command</strong> to <code>node server.js</code></li>
      <li>Add these Environment Variables:
        <ul>
          <li><code>MONGO_URI</code> = your MongoDB Atlas connection string</li>
          <li><code>JWT_SECRET</code> = your secret key</li>
          <li><code>CLIENT_URL</code> = your Vercel frontend URL</li>
        </ul>
      </li>
      <li>Click <strong>Deploy</strong></li>
      <li>Copy the live backend URL — you will need it for the frontend</li>
    </ol>

    <h3>Frontend (Vercel)</h3>
    <ol>
      <li>Go to <a href="https://vercel.com">https://vercel.com</a> and sign in with GitHub</li>
      <li>Click <strong>Add New Project</strong></li>
      <li>Import your GitHub repository</li>
      <li>Set <strong>Root Directory</strong> to <code>frontend</code></li>
      <li>Set <strong>Framework Preset</strong> to <code>Vite</code></li>
      <li>Add this Environment Variable:
        <ul>
          <li><code>VITE_API_URL</code> = your live backend URL from above + <code>/api</code></li>
        </ul>
      </li>
      <li>Click <strong>Deploy</strong></li>
      <li>Your frontend is now live</li>
    </ol>

    <h3>After any code change</h3>
    <div class="code-block">
      <pre><code>git add .
git commit -m "your message"
git push origin main</code></pre>
      <button class="copy-btn" onclick="copyBlock(this)">Copy</button>
    </div>
    <p>Vercel and Render redeploy both frontend and backend automatically.</p>

    <hr/>

    <h2>Push to GitHub</h2>
    <div class="code-block">
      <pre><code>git add .
git commit -m "your message"
git push origin main</code></pre>
      <button class="copy-btn" onclick="copyBlock(this)">Copy</button>
    </div>

    <hr/>
    <p>Built by Shahzaib Khan</p>

  </div>
</div>

<script>
const RAW = `# TaskFlow - MERN Kanban Task Manager

A full stack task management app built with MongoDB, Express, React, and Node.js.

## Live Site

**Frontend:** https://taskflow-app.vercel.app
**Backend:** https://taskflow-api.onrender.com
**Database:** MongoDB Atlas

---

## Features

- Register, login, and manage your profile
- Create boards and organise tasks in a Kanban layout
- Drag and drop task cards across columns
- Assign tasks to teammates with role-based access
- Set priorities, deadlines, and labels on tasks
- Team management with Owner, Admin, and Member roles

---

## Run Locally

### Backend

\`\`\`bash
cd backend
npm install
cp .env.example .env
\`\`\`

Fill in your \`.env\`:

\`\`\`
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=any_random_string
CLIENT_URL=http://localhost:5173
\`\`\`

\`\`\`bash
npm run dev
\`\`\`

### Frontend

\`\`\`bash
cd frontend
npm install
cp .env.example .env
npm run dev
\`\`\`

Fill in your \`.env\`:

\`\`\`
VITE_API_URL=http://localhost:5000/api
\`\`\`

App runs at **http://localhost:5173**

---

## Deploy to Vercel & Render

### Backend (Render)

1. Go to https://render.com and sign in with GitHub
2. Click **New → Web Service**
3. Import your GitHub repository
4. Set **Root Directory** to \`backend\`
5. Set **Build Command** to \`npm install\`
6. Set **Start Command** to \`node server.js\`
7. Add these Environment Variables:
   - \`MONGO_URI\` = your MongoDB Atlas connection string
   - \`JWT_SECRET\` = your secret key
   - \`CLIENT_URL\` = your Vercel frontend URL
8. Click **Deploy**
9. Copy the live backend URL — you will need it for the frontend

### Frontend (Vercel)

1. Go to https://vercel.com and sign in with GitHub
2. Click **Add New Project**
3. Import your GitHub repository
4. Set **Root Directory** to \`frontend\`
5. Set **Framework Preset** to \`Vite\`
6. Add this Environment Variable:
   - \`VITE_API_URL\` = your live backend URL from above + \`/api\`
7. Click **Deploy**
8. Your frontend is now live

### After any code change

\`\`\`bash
git add .
git commit -m "your message"
git push origin main
\`\`\`

Vercel and Render redeploy both frontend and backend automatically.

---

## Push to GitHub

\`\`\`bash
git add .
git commit -m "your message"
git push origin main
\`\`\`

---

Built by Shahzaib Khan`;

function copyAll(btn) {
  navigator.clipboard.writeText(RAW).then(() => {
    btn.textContent = '✓ Copied!';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'Copy all'; btn.classList.remove('copied'); }, 2000);
  });
}

function copyBlock(btn) {
  const code = btn.previousElementSibling.querySelector('code').innerText;
  navigator.clipboard.writeText(code).then(() => {
    btn.textContent = '✓ Copied';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
  });
}
</script>
</body>
</html>