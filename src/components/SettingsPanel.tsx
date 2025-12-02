import type { Mission } from '../types';

interface SettingsPanelProps {
    isOpen: boolean;
    ipAddress: string;
    setIpAddress: (ip: string) => void;
    port: string;
    setPort: (port: string) => void;
    orgId?: string;
    setOrgId?: (id: string) => void;
    missions?: Mission[];
    setMissions?: (missions: Mission[]) => void;
    showMissionConfig?: boolean;
}

export const SettingsPanel = ({
    isOpen,
    ipAddress,
    setIpAddress,
    port,
    setPort,
    orgId,
    setOrgId,
    missions,
    setMissions,
    showMissionConfig
}: SettingsPanelProps) => {

    const handleMissionChange = (index: number, field: keyof Mission, value: string) => {
        if (!missions || !setMissions) return;
        const newMissions = [...missions];
        newMissions[index] = { ...newMissions[index], [field]: value };
        setMissions(newMissions);
    };

    return (
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[600px] pt-2' : 'max-h-0'}`}>
            <div className="pb-6 border-b border-slate-200 space-y-4">
                <div>
                    <h2 className="text-sm font-bold text-slate-600 mb-2">System Connection</h2>
                    <div className="flex flex-col gap-2">
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
                        {orgId !== undefined && setOrgId && (
                            <div>
                                <label htmlFor="orgId" className="block text-xs text-slate-500 mb-1">Organization ID</label>
                                <input
                                    type="text"
                                    id="orgId"
                                    value={orgId}
                                    onChange={(e) => setOrgId(e.target.value)}
                                    placeholder="factory"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-kuka-orange focus:border-kuka-orange"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {showMissionConfig && missions && setMissions && (
                    <div>
                        <h2 className="text-sm font-bold text-slate-600 mb-2">Mission Configuration</h2>
                        <div className="space-y-3">
                            {missions.map((mission, index) => (
                                <div key={index} className="p-3 bg-slate-50 rounded-md border border-slate-200">
                                    <div className="text-xs font-semibold text-slate-500 mb-2">Button {index + 1}</div>
                                    <div className="space-y-2">
                                        <div>
                                            <label htmlFor={`mission-${index}-label`} className="block text-xs text-slate-500 mb-1">Label</label>
                                            <input
                                                type="text"
                                                id={`mission-${index}-label`}
                                                value={mission.label}
                                                onChange={(e) => handleMissionChange(index, 'label', e.target.value)}
                                                className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-kuka-orange"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor={`mission-${index}-code`} className="block text-xs text-slate-500 mb-1">Template Code</label>
                                            <input
                                                type="text"
                                                id={`mission-${index}-code`}
                                                value={mission.templateCode}
                                                onChange={(e) => handleMissionChange(index, 'templateCode', e.target.value)}
                                                className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-kuka-orange"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <p className="text-xs text-slate-500">
                    Note: If using this app from a secure (https://) URL, your browser will block connections to local (http://) devices.
                </p>
            </div>
        </div>
    );
}
