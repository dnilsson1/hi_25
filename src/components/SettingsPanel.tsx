interface SettingsPanelProps {
    isOpen: boolean;
    ipAddress: string;
    setIpAddress: (ip: string) => void;
    port: string;
    setPort: (port: string) => void;
}

export const SettingsPanel = ({ isOpen, ipAddress, setIpAddress, port, setPort }: SettingsPanelProps) => {
    return (
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-48 pt-2' : 'max-h-0'}`}>
            <div className="pb-6 border-b border-slate-200">
                <h2 className="text-sm font-bold text-slate-600 mb-2">System Connection</h2>
                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-grow">
                        <label htmlFor="ipAddress" className="sr-only">IP Address</label>
                        <input
                            type="text"
                            id="ipAddress"
                            value={ipAddress}
                            onChange={(e) => setIpAddress(e.target.value.trim())}
                            placeholder="192.168.1.100"
                            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-kuka-orange focus:border-kuka-orange"
                            aria-label="System IP Address"
                        />
                    </div>
                    <div>
                        <label htmlFor="port" className="sr-only">Port</label>
                        <input
                            type="number"
                            id="port"
                            value={port}
                            onChange={(e) => setPort(e.target.value)}
                            placeholder="80"
                            className="w-full sm:w-24 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-kuka-orange focus:border-kuka-orange"
                            aria-label="System Port"
                        />
                    </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    Note: If using this app from a secure (https://) URL, your browser will block connections to local (http://) devices.
                </p>
            </div>
        </div>
    );
}
