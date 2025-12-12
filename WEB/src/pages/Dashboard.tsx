import { useEffect, useState } from 'react';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { Activity, Wifi, WifiOff, AlertTriangle, X } from 'lucide-react';
import { fetchDashboardStats, fetchRecentActivity, fetchDevices, runPingTest } from '../services/api';
import type { Device } from '../types';

const Dashboard = () => {
    const [stats, setStats] = useState({
        total: 0,
        online: 0,
        offline: 0,
        warning: 0
    });
    const [recentActivity, setRecentActivity] = useState<any[]>([]);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [devices, setDevices] = useState<Device[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState('');
    const [pingLoading, setPingLoading] = useState(false);
    const [pingResult, setPingResult] = useState<any>(null);

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

    useEffect(() => {
        loadData();
    }, []);

    const openDiagnosticModal = async () => {
        setIsModalOpen(true);
        setPingResult(null);
        setSelectedDeviceId('');
        try {
            const deviceList = await fetchDevices();
            setDevices(deviceList);
        } catch (error) {
            console.error('Error loading devices for diagnostic:', error);
        }
    };

    const handleRunPing = async () => {
        if (!selectedDeviceId) return;
        setPingLoading(true);
        setPingResult(null);
        try {
            const result = await runPingTest(selectedDeviceId);
            setPingResult(result);
            loadData(); // Refresh activity log
        } catch (error: any) {
            setPingResult({ error: error.response?.data?.error || 'Erro ao executar teste' });
        } finally {
            setPingLoading(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{ position: 'relative' }}>
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
                        <button
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                            onClick={openDiagnosticModal}
                        >
                            Executar Diagnóstico
                        </button>
                    </div>
                </Card>
            </div>

            {/* Diagnostic Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'var(--bg-card)',
                        padding: '2rem',
                        borderRadius: 'var(--radius-md)',
                        width: '100%', maxWidth: '500px',
                        border: '1px solid var(--border)',
                        position: 'relative'
                    }}>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                        >
                            <X size={24} />
                        </button>

                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Diagnóstico de Rede</h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Selecione o Dispositivo</label>
                            <select
                                value={selectedDeviceId}
                                onChange={(e) => setSelectedDeviceId(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    backgroundColor: 'var(--bg-dark)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-sm)',
                                    color: 'white',
                                    outline: 'none'
                                }}
                            >
                                <option value="">Selecione...</option>
                                {devices.map(dev => (
                                    <option key={dev.id} value={dev.id}>{dev.name} ({dev.ip_address || dev.ip})</option>
                                ))}
                            </select>
                        </div>

                        {pingResult && (
                            <div style={{
                                padding: '1rem',
                                marginBottom: '1.5rem',
                                borderRadius: 'var(--radius-sm)',
                                backgroundColor: pingResult.error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                border: `1px solid ${pingResult.error ? 'var(--error)' : 'var(--success)'}`
                            }}>
                                {pingResult.error ? (
                                    <p style={{ color: 'var(--error)' }}>{pingResult.error}</p>
                                ) : (
                                    <div>
                                        <p style={{ fontWeight: 500, color: 'var(--success)', marginBottom: '0.5rem' }}>Teste Concluído com Sucesso!</p>
                                        <p style={{ fontSize: '0.9rem' }}>Status: <strong>{pingResult.result.status}</strong></p>
                                        <p style={{ fontSize: '0.9rem' }}>Latência: <strong>{pingResult.result.latency ? `${pingResult.result.latency}ms` : 'N/A'}</strong></p>
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                            onClick={handleRunPing}
                            disabled={!selectedDeviceId || pingLoading}
                        >
                            {pingLoading ? 'Executando Ping...' : 'Iniciar Teste'}
                        </button>
                    </div>
                </div>
            )}
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
