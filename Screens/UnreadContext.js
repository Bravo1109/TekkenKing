import { createContext } from 'react';

export const UnreadContext = createContext({
    hasMatches: false,
    setHasMatches: () => {},
    hasMessages: false,
    setHasMessages: () => {},
    hasLobby: false,
    setHasLobby: () => {},
    hasLikes: false,
    setHasLikes: () => {},
    hasReactions: false,
    setHasReactions: () => {},
    hasAlfredMes: false,
    setHasAlfredMes: () => {},
    hasPartyRequests: false,
    setHasPartyRequests: () => {},
    hasAcceptedPartyRequests: false,
    setHasAcceptedPartyRequests: () => {}
});