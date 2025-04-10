import React from 'react';
import { DocumentsList } from '../../components/documents/DocumentsList';

export const Documents: React.FC = () => {
  return (
    <div className="space-y-6">
      <DocumentsList />
    </div>
  );
};

export default Documents; 