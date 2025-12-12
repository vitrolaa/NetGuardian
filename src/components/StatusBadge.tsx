

const StatusBadge = ({ status }: { status: 'online' | 'offline' | 'warning' }) => {
    const styles = {
        online: { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: 'rgba(16, 185, 129, 0.3)' },
        offline: { bg: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: 'rgba(239, 68, 68, 0.3)' },
        warning: { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' },
    };

    const current = styles[status] || styles.offline;

    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 600,
            backgroundColor: current.bg,
            color: current.color,
            border: `1px solid ${current.border}`,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
        }}>
            <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: current.color,
                boxShadow: `0 0 6px ${current.color}`
            }} />
            {status}
        </span>
    );
};

export default StatusBadge;
