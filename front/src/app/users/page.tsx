import React from 'react';
import Dashboard from '../Dashboard';
import UsersPage from '@/components/users/UsersPage';

const page = () => {
  return (
    <Dashboard>
      <UsersPage />
    </Dashboard>
  );
};

export default page;
