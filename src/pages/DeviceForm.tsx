import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../components/Card';
import { createDevice, fetchDeviceById, updateDevice } from '../services/api';
import { ArrowLeft, Save } from 'lucide-react';

const DeviceForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        name: '',
        ip_address: '',
        type: 'server'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEditing) {
            const loadDevice = async () => {
                try {
                    const device = await fetchDeviceById(id);
                    setFormData({
                        name: device.name,
                        ip_address: device.ip_address,
                        type: device.type
                    });
                } catch (err) {
                    setError('Erro ao carregar dispositivo');
                    console.error(err);
                }
            };
            loadDevice();
        }
    }, [id, isEditing]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEditing) {
                await updateDevice(id, formData);
            } else {
                await createDevice(formData);
            }
            navigate('/inventory');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || 'Erro ao salvar dispositivo');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => navigate('/inventory')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
                        {isEditing ? 'Editar Dispositivo' : 'Novo Dispositivo'}
                    </h2>
                    <p style={{ color: 'var(--text-muted)' }}>Preencha as informações abaixo</p>
                </div>
            </header>

            <Card>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
                    {error && (
                        <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: 'var(--radius-sm)' }}>
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Nome do Dispositivo</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={{
                                padding: '0.75rem',
                                backgroundColor: 'var(--bg-dark)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-sm)',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Endereço IP</label>
                        <input
                            type="text"
                            name="ip_address"
                            value={formData.ip_address}
                            onChange={handleChange}
                            required
                            placeholder="Ex: 192.168.1.10"
                            style={{
                                padding: '0.75rem',
                                backgroundColor: 'var(--bg-dark)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-sm)',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Tipo</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            style={{
                                padding: '0.75rem',
                                backgroundColor: 'var(--bg-dark)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-sm)',
                                color: 'white',
                                outline: 'none'
                            }}
                        >
                            <option value="server">Servidor</option>
                            <option value="router">Roteador</option>
                            <option value="switch">Switch</option>
                            <option value="workstation">Estação de Trabalho</option>
                            <option value="printer">Impressora</option>
                            <option value="other">Outro</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Save size={18} />
                            {loading ? 'Salvando...' : 'Salvar Dispositivo'}
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default DeviceForm;
