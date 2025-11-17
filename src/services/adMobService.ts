import mobileAds, {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

// Initialize AdMob
export const initializeAdMob = async () => {
  try {
    await mobileAds().initialize();
    console.log('✅ AdMob initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ AdMob initialization error:', error);
    return false;
  }
};

// Rewarded Ad for Multiplier Upgrade
let rewardedAd: RewardedAd | null = null;
let isAdLoaded = false;
let isAdLoading = false;

// Create and load rewarded ad
export const loadRewardedAd = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (isAdLoading) {
      console.log('⏳ Ad already loading...');
      resolve(false);
      return;
    }

    if (isAdLoaded) {
      console.log('✅ Ad already loaded');
      resolve(true);
      return;
    }

    isAdLoading = true;
    
    // Use your real Ad Unit ID
    const adUnitId = 'ca-app-pub-3604124226782932/9859097199';
    
    rewardedAd = RewardedAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: false,
    });

    // Listen for ad loaded event
    const unsubscribeLoaded = rewardedAd.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        isAdLoaded = true;
        isAdLoading = false;
        console.log('✅ Rewarded ad loaded successfully');
        unsubscribeLoaded();
        resolve(true);
      }
    );

    // Load the ad
    try {
      rewardedAd.load();
      console.log('⏳ Loading rewarded ad...');
      
      // Timeout after 30 seconds
      setTimeout(() => {
        if (isAdLoading) {
          isAdLoading = false;
          isAdLoaded = false;
          console.error('❌ Ad load timeout');
          unsubscribeLoaded();
          resolve(false);
        }
      }, 30000);
    } catch (error) {
      console.error('❌ Error loading ad:', error);
      isAdLoading = false;
      unsubscribeLoaded();
      resolve(false);
    }
  });
};

// Show rewarded ad and return promise
export const showRewardedAd = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (!rewardedAd || !isAdLoaded) {
      console.log('⚠️ Rewarded ad not loaded yet');
      reject(new Error('Ad not loaded'));
      return;
    }

    let rewardEarned = false;
    let adClosed = false;

    // Listen for reward earned
    const unsubscribeEarned = rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log('🎉 User earned reward:', reward);
        rewardEarned = true;
        
        // Clean up after short delay
        setTimeout(() => {
          unsubscribeEarned();
          isAdLoaded = false;
          
          // Preload next ad
          loadRewardedAd();
          
          // Resolve with success
          if (!adClosed) {
            adClosed = true;
            resolve(true);
          }
        }, 1000);
      }
    );

    // Show the ad
    try {
      rewardedAd.show();
      console.log('📺 Showing rewarded ad...');
      
      // Safety timeout - assume ad was closed if no reward after 2 minutes
      setTimeout(() => {
        if (!adClosed) {
          console.log('⏱️ Ad timeout - assuming closed without reward');
          adClosed = true;
          unsubscribeEarned();
          isAdLoaded = false;
          loadRewardedAd();
          resolve(rewardEarned);
        }
      }, 120000); // 2 minute timeout
    } catch (error) {
      console.error('❌ Error showing ad:', error);
      unsubscribeEarned();
      reject(error);
    }
  });
};

// Check if ad is ready
export const isRewardedAdReady = (): boolean => {
  return isAdLoaded;
};

// Check if ad is loading
export const isRewardedAdLoading = (): boolean => {
  return isAdLoading;
};
