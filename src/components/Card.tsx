

interface CardProps {
    children: React.ReactNode;
    title?: string;
    className?: string;
}

const Card = ({ children, title, className = '' }: CardProps) => {
    return (
        <div className={`glass-panel ${className}`} style={{ padding: '1.5rem', height: '100%' }}>
            {title && (
                <h3 style={{
                    marginBottom: '1rem',
                    fontSize: '1.1rem',
                    color: 'var(--text-muted)',
                    fontWeight: 500
                }}>
                    {title}
                </h3>
            )}
            {children}
        </div>
    );
};

export default Card;
