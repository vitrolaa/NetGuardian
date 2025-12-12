import { useEffect, useState } from 'react';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { Activity, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { fetchDashboardStats, fetchRecentActivity } from '../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        total: 0,
        online: 0,
        offline: 0,
        warning: 0
    });
    const [recentActivity, setRecentActivity] = useState<any[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const statsData = await fetchDashboardStats();
                setStats(statsData);
                const activityData = await fetchRecentActivity();
                setRecentActivity(activityData);
            } catch (error) {
                console.error('Error loading dashboard data:', error);
            }
        };
        loadData();
    }, []);

    return (
        <div className="animate-fade-in">
            <header style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Dashboard</h2>
                <p style={{ color: 'var(--text-muted)' }}>Visão geral da rede em tempo real</p>
            </header>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                <StatCard
                    title="Total de Dispositivos"
                    value={stats.total}
                    icon={<Activity size={24} color="#3b82f6" />}
                />
                <StatCard
                    title="Online"
                    value={stats.online}
                    icon={<Wifi size={24} color="#10b981" />}
                />
                <StatCard
                    title="Offline"
                    value={stats.offline}
                    icon={<WifiOff size={24} color="#ef4444" />}
                    isAlert
                />
                <StatCard
                    title="Alertas"
                    value={stats.warning}
                    icon={<AlertTriangle size={24} color="#f59e0b" />}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                {/* Recent Activity */}
                <Card title="Atividade Recente">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {recentActivity.length === 0 && (
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                                Nenhuma atividade recente.
                            </p>
                        )}
                        {recentActivity.map((log) => (
                            <div key={log.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '1rem',
                                backgroundColor: 'rgba(255,255,255,0.02)',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        width: '36px', height: '36px', borderRadius: '8px',
                                        backgroundColor: 'var(--bg-dark)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        border: '1px solid var(--border)'
                                    }}>
                                        <Activity size={16} color="var(--text-muted)" />
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 500 }}>{log.device_name}</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(log.timestamp).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <StatusBadge status={log.status as any} />
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                        {log.latency > 0 ? `${log.latency}ms` : 'Timeout'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Quick Actions / System Health */}
                <Card title="Status do Servidor">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                            <div style={{
                                width: '120px', height: '120px', borderRadius: '50%',
                                border: '4px solid var(--primary)',
                                margin: '0 auto 1rem',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 0 20px var(--primary-glow)'
                            }}>
                                <span style={{ fontSize: '2rem', fontWeight: 700 }}>100%</span>
                            </div>
                            <p style={{ color: 'var(--text-muted)' }}>Uptime da Rede</p>
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%' }}>
                            Executar Diagnóstico
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, trend, isAlert }: any) => (
    <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{title}</p>
                <h3 style={{ fontSize: '2rem', color: isAlert ? 'var(--error)' : 'var(--text-main)' }}>{value}</h3>
            </div>
            <div style={{
                padding: '10px', borderRadius: '10px',
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)'
            }}>
                {icon}
            </div>
        </div>
        {trend && <p style={{ fontSize: '0.8rem', color: 'var(--success)' }}>{trend}</p>}
    </Card>
);

export default Dashboard;
