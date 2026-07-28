export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '48px',
        maxWidth: '800px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '12px' }}>🎓</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
            Student Portal
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '1rem' }}>
            Complete Full-Stack Project — Node.js + Express + MySQL
          </p>
        </div>

        {/* Tech Stack */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          marginBottom: '32px'
        }}>
          {[
            { icon: '🌐', label: 'HTML / CSS / JS', color: '#f97316' },
            { icon: '🟢', label: 'Node.js + Express', color: '#16a34a' },
            { icon: '🗄️', label: 'MySQL Database', color: '#0284c7' },
            { icon: '🔐', label: 'bcrypt + Sessions', color: '#7c3aed' },
          ].map((t) => (
            <div key={t.label} style={{
              background: '#f8fafc',
              border: `2px solid ${t.color}22`,
              borderRadius: '10px',
              padding: '14px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.6rem' }}>{t.icon}</div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: t.color, marginTop: '6px' }}>
                {t.label}
              </div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>
            ✅ Features Included
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[
              '🛡️ Admin Panel with login',
              '➕ Add students (auto ID + password)',
              '📝 Enter subject-wise marks',
              '🤖 Math CAPTCHA on student login',
              '🔐 bcrypt password hashing',
              '🍪 express-session auth',
              '📊 Marks table with grades',
              '📱 Responsive design',
              '🗑️ Delete students & marks',
              '📋 Copy credentials button',
            ].map((f) => (
              <div key={f} style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '0.82rem',
                color: '#15803d',
                fontWeight: 500
              }}>
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* File Structure */}
        <div style={{
          background: '#1e293b',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '32px',
          fontFamily: 'monospace',
          fontSize: '0.82rem',
          color: '#94a3b8',
          lineHeight: '1.8'
        }}>
          <div style={{ color: '#f1f5f9', fontWeight: 700, marginBottom: '8px' }}>
            📁 student-portal/
          </div>
          <div style={{ paddingLeft: '16px' }}>
            <div style={{ color: '#60a5fa' }}>├── backend/</div>
            <div style={{ paddingLeft: '16px' }}>
              <div>├── routes/ <span style={{ color: '#6b7280' }}>(admin.js, student.js, captcha.js)</span></div>
              <div>├── middleware/ <span style={{ color: '#6b7280' }}>(auth.js)</span></div>
              <div>├── <span style={{ color: '#34d399' }}>server.js</span> <span style={{ color: '#6b7280' }}>(main entry)</span></div>
              <div>├── <span style={{ color: '#34d399' }}>db.js</span> <span style={{ color: '#6b7280' }}>(MySQL pool)</span></div>
              <div>└── <span style={{ color: '#fbbf24' }}>.env</span> <span style={{ color: '#6b7280' }}>(your secrets)</span></div>
            </div>
            <div style={{ color: '#60a5fa' }}>├── frontend/public/</div>
            <div style={{ paddingLeft: '16px' }}>
              <div>├── <span style={{ color: '#34d399' }}>index.html</span> <span style={{ color: '#6b7280' }}>(student login)</span></div>
              <div>├── <span style={{ color: '#34d399' }}>dashboard.html</span> <span style={{ color: '#6b7280' }}>(marks view)</span></div>
              <div>├── <span style={{ color: '#34d399' }}>admin-login.html</span></div>
              <div>└── <span style={{ color: '#34d399' }}>admin-dashboard.html</span></div>
            </div>
            <div style={{ color: '#60a5fa' }}>├── database/</div>
            <div style={{ paddingLeft: '16px' }}>
              <div>└── <span style={{ color: '#fbbf24' }}>setup.sql</span> <span style={{ color: '#6b7280' }}>(CREATE TABLE statements)</span></div>
            </div>
            <div>└── <span style={{ color: '#f1f5f9' }}>README.md</span> <span style={{ color: '#6b7280' }}>(full setup guide)</span></div>
          </div>
        </div>

        {/* Quick Start */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>
            🚀 Quick Start (3 Commands)
          </h2>
          {[
            { step: '1', cmd: 'mysql -u root -p < database/setup.sql', label: 'Setup MySQL database' },
            { step: '2', cmd: 'cd backend && npm install', label: 'Install dependencies' },
            { step: '3', cmd: 'npm start', label: 'Start server → http://localhost:5000' },
          ].map((s) => (
            <div key={s.step} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '10px',
              background: '#f8fafc',
              borderRadius: '10px',
              padding: '12px 16px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                width: '28px', height: '28px', background: '#4f46e5',
                color: 'white', borderRadius: '50%', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', fontWeight: 700, flexShrink: 0
              }}>
                {s.step}
              </div>
              <div>
                <code style={{
                  background: '#1e293b', color: '#34d399',
                  padding: '2px 8px', borderRadius: '4px', fontSize: '0.82rem'
                }}>
                  {s.cmd}
                </code>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Default Credentials */}
        <div style={{
          background: '#fffbeb',
          border: '2px solid #fde68a',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <h3 style={{ color: '#92400e', fontSize: '0.9rem', fontWeight: 700, margin: '0 0 12px' }}>
            🔑 Default Admin Credentials
          </h3>
          <div style={{ display: 'flex', gap: '24px', fontSize: '0.88rem' }}>
            <div>
              <span style={{ color: '#78716c' }}>Username: </span>
              <code style={{ fontWeight: 700, color: '#1e293b' }}>admin</code>
            </div>
            <div>
              <span style={{ color: '#78716c' }}>Password: </span>
              <code style={{ fontWeight: 700, color: '#1e293b' }}>password</code>
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#92400e', margin: '8px 0 0' }}>
            ⚠️ Change these in production! See README.md for instructions.
          </p>
        </div>

        <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem' }}>
          📖 See <strong>student-portal/README.md</strong> for full setup guide,
          API reference, and Railway/Vercel deployment instructions.
        </div>
      </div>
    </main>
  );
}
