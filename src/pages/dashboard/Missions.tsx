import React from 'react';
import { MissionsList } from '../../components/missions/MissionsList';

const Missions: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <MissionsList />
    </div>
  );
};

export default Missions; 