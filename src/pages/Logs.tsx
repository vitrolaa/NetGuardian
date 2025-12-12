import Card from '../components/Card';
import { FileText, Download } from 'lucide-react';

const Logs = () => {
    const logs: any[] = [];

    return (
        <div className="animate-fade-in">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Histórico de Logs</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Registro de eventos e testes de conectividade</p>
                </div>
                <button className="btn btn-outline">
                    <Download size={18} />
                    Exportar CSV
                </button>
            </header>

            <Card>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {logs.length === 0 && (
                        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                            Nenhum log registrado.
                        </p>
                    )}
                    {logs.map((log) => (
                        <div key={log.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1rem',
                            borderBottom: '1px solid rgba(255,255,255,0.03)',
                            fontSize: '0.95rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{log.timestamp}</span>
                                <span style={{ fontWeight: 500 }}>{log.device}</span>
                                <span style={{
                                    color: log.type === 'error' ? 'var(--error)' : 'var(--success)',
                                    display: 'flex', alignItems: 'center', gap: '0.5rem'
                                }}>
                                    {log.event}
                                </span>
                            </div>
                            <FileText size={16} color="var(--text-muted)" />
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default Logs;
