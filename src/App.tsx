import { useState, useEffect, useCallback } from 'react';
import { PROFILE_2_MISSIONS, PROFILE_3_MISSIONS, ORG_ID } from './constants';
import type { Mission, Status } from './types';

import { KukaLogo } from './components/KukaLogo';
import { MissionButton } from './components/MissionButton';
import { StatusDisplay } from './components/StatusDisplay';
import { ConfirmationModal } from './components/ConfirmationModal';
import { SettingsPanel } from './components/SettingsPanel';
import { GearIcon } from './components/icons/GearIcon';
import { SwitchProfileIcon } from './components/icons/SwitchProfileIcon';

export const App = () => {
  const [currentProfile, setCurrentProfile] = useState('profile2');
  const [missions, setMissions] = useState<Mission[]>(() => {
    const saved = localStorage.getItem('kukaMissions');
    return saved ? JSON.parse(saved) : PROFILE_2_MISSIONS;
  });
  const [status, setStatus] = useState<Status>({ type: 'idle', message: '' });
  const [loadingMission, setLoadingMission] = useState<string | null>(null);

  const [ipAddress, setIpAddress] = useState(() => localStorage.getItem('kukaIpAddress') || '192.168.1.100');
  const [port, setPort] = useState(() => localStorage.getItem('kukaPort') || '10870');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const [profile2Missions, setProfile2Missions] = useState<Mission[]>(() => {
    const saved = localStorage.getItem('kukaMissionsProfile2');
    return saved ? JSON.parse(saved) : PROFILE_2_MISSIONS;
  });

  const [orgId, setOrgId] = useState(() => localStorage.getItem('kukaOrgId') || ORG_ID);

  useEffect(() => {
    localStorage.setItem('kukaIpAddress', ipAddress);
  }, [ipAddress]);

  useEffect(() => {
    localStorage.setItem('kukaPort', port);
  }, [port]);

  useEffect(() => {
    localStorage.setItem('kukaOrgId', orgId);
  }, [orgId]);

  useEffect(() => {
    localStorage.setItem('kukaMissions', JSON.stringify(missions));
  }, [missions]);

  useEffect(() => {
    localStorage.setItem('kukaMissionsProfile2', JSON.stringify(profile2Missions));
  }, [profile2Missions]);

  useEffect(() => {
    if (currentProfile === 'profile2') {
      setMissions(profile2Missions);
    } else {
      setMissions(PROFILE_3_MISSIONS);
    }
  }, [currentProfile, profile2Missions]);

  const handleProfileToggle = () => {
    setConfirmationModalOpen(true);
  };

  const handleConfirmSwitch = () => {
    setCurrentProfile(prev => (prev === 'profile2' ? 'profile3' : 'profile2'));
    setConfirmationModalOpen(false);
  };

  const handleCancelSwitch = () => {
    setConfirmationModalOpen(false);
  };

  const handleSubmitMission = useCallback(async (mission: Mission) => {
    if (!ipAddress || !port) {
      setStatus({ type: 'error', message: 'Please set the system IP address and Port.' });
      setIsSettingsOpen(true);
      setTimeout(() => setStatus({ type: 'idle', message: '' }), 5000);
      return;
    }

    let payload: object;

    // Generate unique IDs
    const requestId = crypto.randomUUID();
    // missionCode needs to be unique. We can use the requestId or generate another UUID.
    // The user example had "job-" prefix with timestamp. Let's use "job-" + UUID to be safe and consistent.
    const missionCode = `job-${crypto.randomUUID()}`;

    if (mission.templateCode === 'outbound') {
      payload = {
        requestId: requestId,
        containerType: "",
        containerCode: "",
        position: mission.position, // Use position from the specific mission
        isDelete: true,
      };
    } else {
      payload = {
        orgId: orgId,
        requestId: requestId,
        missionCode: missionCode,
        missionType: "MOVE",
        viewBoardType: "",
        robotType: "LIFT",
        robotModels: [],
        robotIds: [],
        priority: 1,
        containerType: "",
        containerCode: "",
        templateCode: mission.templateCode,
        lockRobotAfterFinish: false,
        unlockRobotId: "",
        unlockMissionCode: "",
        idleNode: ""
      };
    }

    const targetUrl = mission.templateCode === 'outbound'
      ? `https://${ipAddress}:${port}/api/amr/containerOut`
      : `https://${ipAddress}:${port}/interfaces/api/amr/submitMission`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    console.log('Dispatching Mission:', JSON.stringify(payload, null, 2));
    console.log(`Fetch URL: ${targetUrl}`);
    setStatus({ type: 'loading', message: `Dispatching '${mission.label}'...` });
    setLoadingMission(mission.label);

    try {
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
      });

      console.log(`Response Status: ${response.status} ${response.statusText}`);

      let responseData;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        responseData = await response.json();
        console.log('Response Data:', responseData);
      } else {
        const text = await response.text();
        console.log('Response Text:', text);
      }

      if (!response.ok) {
        const apiMessage = responseData?.message || `HTTP Error: ${response.statusText}`;
        throw new Error(apiMessage);
      }

      setStatus({ type: 'success', message: `Mission '${mission.label}' dispatched successfully!` });

    } catch (error) {
      console.error('Failed to dispatch mission:', error);
      let errorMessage: string;
      if (error instanceof TypeError) {
        errorMessage = `Network error. Could not connect to ${ipAddress}:${port}. Check IP/Port, network connection, and ensure SSL is trusted.`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = 'An unknown error occurred.';
      }
      setStatus({ type: 'error', message: `Failed: ${errorMessage}` });
    } finally {
      setLoadingMission(null);
      setTimeout(() => setStatus({ type: 'idle', message: '' }), 5000);
    }
  }, [ipAddress, port]);

  const getNextProfileName = () => {
    if (currentProfile === 'profile2') return 'Container control';
    return 'Demo Flows';
  };

  const getCurrentProfileName = () => {
    if (currentProfile === 'profile2') return 'Demo Flows';
    return 'Container control';
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          <header className="flex justify-center items-center mb-4">
            <KukaLogo className="w-48 h-auto" />
          </header>

          <main className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex justify-end gap-2 mb-4">
              <button
                onClick={handleProfileToggle}
                className="text-slate-400 hover:text-kuka-orange transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kuka-orange rounded-full p-1"
                aria-label="Switch Profile"
              >
                <SwitchProfileIcon className="w-6 h-6" />
              </button>
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="text-slate-400 hover:text-kuka-orange transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kuka-orange rounded-full p-1"
                aria-label={isSettingsOpen ? 'Close connection settings' : 'Open connection settings'}
                aria-expanded={isSettingsOpen}
              >
                <GearIcon className="w-6 h-6" />
              </button>
            </div>

            <SettingsPanel
              isOpen={isSettingsOpen}
              ipAddress={ipAddress}
              setIpAddress={setIpAddress}
              port={port}
              setPort={setPort}
              orgId={orgId}
              setOrgId={setOrgId}
              missions={profile2Missions}
              setMissions={setProfile2Missions}
              showMissionConfig={currentProfile === 'profile2'}
            />

            <div className="text-center p-3 bg-slate-100 rounded-lg">
              <span className="text-sm font-medium text-slate-600">Current Workstation: </span>
              <span className="font-bold text-kuka-dark">
                {getCurrentProfileName()}
              </span>
            </div>

            <div className="my-4">
              <StatusDisplay status={status.type} message={status.message} />
            </div>

            <div className="space-y-4">
              {missions.map((mission) => (
                <MissionButton
                  key={mission.label}
                  label={mission.label}
                  onClick={() => handleSubmitMission(mission)}
                  isLoading={loadingMission === mission.label}
                  disabled={!ipAddress || (loadingMission !== null && loadingMission !== mission.label)}
                />
              ))}
            </div>
          </main>
          <footer className="text-center mt-8 text-xs text-slate-500">
            <p>AMR Mission Control Interface</p>
            <p>Created by: Daniel Nilsson</p>
          </footer>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onConfirm={handleConfirmSwitch}
        onCancel={handleCancelSwitch}
        profileName={getNextProfileName()}
      />
    </>
  );
};
