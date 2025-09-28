import type { Mission } from './types';

export const ORG_ID = 'factory';

export const PROFILE_2_MISSIONS: Mission[] = [
    {
        label: "Collect from Station 2",
        templateCode: 'packing',
    },
    {
        label: "Dispatch from Station 2",
        templateCode: 'packing_station2',
    },
];

export const PROFILE_3_MISSIONS: Mission[] = [
    {
        label: "Remove Pallet at pos 1",
        templateCode: 'outbound',
        position: 'pos1'
    },
    {
        label: "Remove Pallet at pos 2",
        templateCode: 'outbound',
        position: 'pos2'
    }
];
