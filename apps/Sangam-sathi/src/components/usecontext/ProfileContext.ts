import { createContext } from 'react';

const ProfileContext = createContext<any>({ 
  profile: null, 
  getProfileByRegistrationNo: async () => null,
  setProfile: () => {}
});

export default ProfileContext;