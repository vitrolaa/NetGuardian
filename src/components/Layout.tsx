import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Server, FileText, Activity } from 'lucide-react';

const Layout = () => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <aside style={{
                width: '260px',
                backgroundColor: 'var(--bg-card)',
                borderRight: '1px solid var(--border)',
                padding: '2rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 10
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Activity color="white" size={24} />
                    </div>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: '700', background: 'linear-gradient(to right, #fff, #a1a1aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        NetGuardian
                    </h1>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
                    <NavItem to="/inventory" icon={<Server size={20} />} label="Dispositivos" />
                    <NavItem to="/logs" icon={<FileText size={20} />} label="Histórico" />
                </nav>

                <div style={{ marginTop: 'auto', padding: '1rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(255,255,255,0.03)' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status do Sistema</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)', boxShadow: '0 0 8px var(--success)' }}></span>
                        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Online</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{
                flex: 1,
                marginLeft: '260px',
                padding: '2rem',
                maxWidth: '1600px',
                width: '100%'
            }}>
                <Outlet />
            </main>
        </div>
    );
};

const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
    <NavLink
        to={to}
        style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.875rem 1rem',
            borderRadius: 'var(--radius-sm)',
            textDecoration: 'none',
            color: isActive ? 'white' : 'var(--text-muted)',
            backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
            borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
            transition: 'all 0.2s ease',
            fontWeight: isActive ? 500 : 400
        })}
    >
        {icon}
        <span>{label}</span>
    </NavLink>
);

export default Layout;
