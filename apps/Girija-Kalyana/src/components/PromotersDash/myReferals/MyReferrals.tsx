import React from 'react';
import ReferralsTable from './ReferralsTable';

interface MyReferralsProps {
  initialTab?: string;
}

const MyReferrals: React.FC<MyReferralsProps> = ({ initialTab = 'all' }) => {
  return <ReferralsTable initialTab={initialTab} />;
};

export default MyReferrals;
