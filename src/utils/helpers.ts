// # Generic helper functions

export const isAgent = (role: string) => role === 'agent';
export const isUser = (role: string) => role === 'user';

export const isLoggedIn = (role: string) => role !== null;
