import { useEffect, useRef } from 'react';

const CHANNEL_NAME = 'el-rival-mas-debil-sync';

export const useGameSync = (role, onStateReceived, onRequestState) => {
  const channelRef = useRef(null);

  useEffect(() => {
    // Initialize channel
    channelRef.current = new BroadcastChannel(CHANNEL_NAME);

    channelRef.current.onmessage = (event) => {
      const { type, payload } = event.data || {};

      // If we received a state update and we are a RECEIVER
      if (role === 'RECEIVER' && type === 'STATE_UPDATE') {
        if (onStateReceived) {
          onStateReceived(payload);
        }
      }

      // If we received a request for state and we are a SENDER
      if (role === 'SENDER' && type === 'REQUEST_STATE') {
        if (onRequestState) {
          onRequestState();
        }
      }
    };

    return () => {
      if (channelRef.current) {
        channelRef.current.close();
      }
    };
  }, [role, onStateReceived, onRequestState]);

  // Function to broadcast state (called by SENDER/Host)
  const broadcastState = (state) => {
    if (channelRef.current && role === 'SENDER') {
      channelRef.current.postMessage({ type: 'STATE_UPDATE', payload: state });
    }
  };

  // Function to request state (called by RECEIVER on amount)
  const requestInitialState = () => {
    if (channelRef.current && role === 'RECEIVER') {
      channelRef.current.postMessage({ type: 'REQUEST_STATE' });
    }
  }

  return { broadcastState, requestInitialState };
};
