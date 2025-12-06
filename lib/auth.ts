import { supabase } from './supabase';

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getUserType = async (userId: string) => {
  const { data } = await supabase
    .from('profiles')
    .select('user_type')
    .eq('id', userId)
    .single();
  
  return data?.user_type || 'user';
};

export const isAdmin = () => {
  return localStorage.getItem('userType') === 'admin';
};

export const logout = async () => {
  await supabase.auth.signOut();
  localStorage.removeItem('userType');
};