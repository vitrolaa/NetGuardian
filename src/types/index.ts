export interface Device {
    id: string;
    name: string;
    ip_address: string;
    ip?: string; // Keep for backward compatibility if needed, or remove
    type: 'server' | 'router' | 'switch' | 'workstation' | 'printer' | 'other';
    status: 'online' | 'offline' | 'warning';
    lastPing?: string;
}

export interface Log {
    id: string;
    deviceId: string;
    deviceName: string;
    timestamp: string;
    status: 'success' | 'failure';
    latency: number;
}
