import React from 'react';
import { MissionsList } from '../../components/missions/MissionsList';

const Missions: React.FC = () => {
  return (
    <div className="w-full">
      <MissionsList />
    </div>
  );
};

export default Missions;