// client/src/services/useUserSync.ts
'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState, useRef } from 'react';

// Global singleton để prevent duplicate sync
const globalSyncState = {
  isInitialized: false,
  syncing: false,
  synced: false,
  syncError: '',
  lastSyncUserId: '',
  syncPromise: null as Promise<void> | null
};

export const useUserSync = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const [syncing, setSyncing] = useState(globalSyncState.syncing);
  const [synced, setSynced] = useState(globalSyncState.synced);
  const [syncError, setSyncError] = useState(globalSyncState.syncError);
  const syncingRef = useRef(false);

  const updateGlobalState = (newState: Partial<typeof globalSyncState>) => {
    Object.assign(globalSyncState, newState);
    setSyncing(globalSyncState.syncing);
    setSynced(globalSyncState.synced);
    setSyncError(globalSyncState.syncError);
  };

  const performSync = async (reason = 'login') => {
    if (!isSignedIn || !user) return;

    // Prevent duplicate sync calls
    if (globalSyncState.syncing || syncingRef.current) {
      console.log('Sync already in progress, skipping...');
      return globalSyncState.syncPromise;
    }

    // Check if already synced for this user
    if (globalSyncState.synced && globalSyncState.lastSyncUserId === user.id) {
      console.log('User already synced, skipping...');
      return;
    }

    console.log(`Starting sync - reason: ${reason}`);
    
    syncingRef.current = true;
    updateGlobalState({ syncing: true, syncError: '' });

    const syncPromise = (async () => {
      try {
        const response = await fetch('/api/user/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reason }),
        });

        const data = await response.json();

        if (data.success) {
          updateGlobalState({
            synced: true,
            lastSyncUserId: user.id,
            syncError: ''
          });
          console.log(`Sync completed - action: ${data.data?.action || 'completed'}`);
        } else {
          updateGlobalState({ syncError: data.error });
          console.error('Sync failed:', data.error);
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        updateGlobalState({ syncError: errorMessage });
        console.error('Sync error:', error);
      } finally {
        syncingRef.current = false;
        updateGlobalState({ syncing: false });
        globalSyncState.syncPromise = null;
      }
    })();

    globalSyncState.syncPromise = syncPromise;
    return syncPromise;
  };

  // Auto sync logic
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) {
      if (isLoaded && !isSignedIn) {
        // Reset khi user sign out
        updateGlobalState({
          isInitialized: false,
          syncing: false,
          synced: false,
          syncError: '',
          lastSyncUserId: ''
        });
      }
      return;
    }

    // Nếu đã init cho user này rồi thì skip
    if (globalSyncState.isInitialized && globalSyncState.lastSyncUserId === user.id) {
      return;
    }

    // Check cache để xem có cần sync không
    const cacheKey = `user_sync_${user.id}`;
    const userDataKey = `user_data_${user.id}`;
    
    const lastSyncTime = localStorage.getItem(cacheKey);
    const lastUserData = localStorage.getItem(userDataKey);
    
    const currentUserData = JSON.stringify({
      email: user.emailAddresses?.[0]?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName
    });

    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    let shouldSync = false;
    let reason = 'login';

    if (!lastSyncTime) {
      // First time
      shouldSync = true;
      reason = 'first_time';
    } else if (lastUserData !== currentUserData) {
      // Data changed
      shouldSync = true;
      reason = 'profile_update';
    } else if ((now - parseInt(lastSyncTime)) < oneHour) {
      // Recently synced and no changes
      updateGlobalState({
        isInitialized: true,
        synced: true,
        lastSyncUserId: user.id
      });
      console.log('User already synced recently, using cache');
      return;
    }

    if (shouldSync) {
      updateGlobalState({ isInitialized: true });
      performSync(reason).then(() => {
        // Update cache
        localStorage.setItem(cacheKey, now.toString());
        localStorage.setItem(userDataKey, currentUserData);
      });
    } else {
      updateGlobalState({
        isInitialized: true,
        synced: true,
        lastSyncUserId: user.id
      });
    }

  }, [isLoaded, isSignedIn, user?.id]);

  return {
    syncing,
    synced,
    syncError,
    // Manual sync functions
    forceSync: () => performSync('manual'),
    syncOnProfileUpdate: () => performSync('profile_update')
  };
};