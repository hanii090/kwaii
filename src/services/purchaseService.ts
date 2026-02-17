import { Platform } from 'react-native';
import Purchases, {
  PurchasesOffering,
  PurchasesPackage,
  CustomerInfo,
  LOG_LEVEL,
} from 'react-native-purchases';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';

// Platform-specific API keys from .env
const API_Keys = {
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY ?? '',
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY ?? '',
};

// The entitlement identifier configured in RevenueCat dashboard
// IMPORTANT: Create an entitlement in RevenueCat named 'kwaii_pro'
const ENTITLEMENT_ID = 'kwaii_pro';

class PurchaseServiceClass {
  private initialized = false;

  /**
   * Initialize RevenueCat SDK. Call once on app start.
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    const apiKey = Platform.select({
      ios: API_Keys.ios,
      android: API_Keys.android,
    });

    if (!apiKey) {
      if (__DEV__) console.warn(`RevenueCat API key not set for ${Platform.OS}, skipping initialization`);
      return;
    }

    try {
      if (__DEV__) {
        Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      }

      Purchases.configure({ apiKey });
      this.initialized = true;
      if (__DEV__) console.log('RevenueCat initialized successfully');
    } catch (error) {
      if (__DEV__) console.warn('RevenueCat init failed:', error);
    }
  }

  /**
   * Check if the SDK has been initialized.
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get the current customer info.
   */
  async getCustomerInfo(): Promise<CustomerInfo | null> {
    try {
      return await Purchases.getCustomerInfo();
    } catch {
      return null;
    }
  }

  /**
   * Check if the user currently has the kwaii_pro entitlement.
   */
  async checkPremiumStatus(): Promise<boolean> {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      return this.hasPremium(customerInfo);
    } catch {
      return false;
    }
  }

  /**
   * Get the current offering with all packages (monthly, yearly, lifetime).
   */
  async getOffering(): Promise<PurchasesOffering | null> {
    try {
      const offerings = await Purchases.getOfferings();
      return offerings.current;
    } catch {
      return null;
    }
  }

  /**
   * Purchase a specific package. Returns true if successful.
   */
  async purchasePackage(pkg: PurchasesPackage): Promise<boolean> {
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      return this.hasPremium(customerInfo);
    } catch (error: any) {
      if (error.userCancelled) return false;
      throw error;
    }
  }

  /**
   * Present the RevenueCat Paywall (configured in dashboard).
   * Returns true if a purchase or restore was made.
   */
  async presentPaywall(): Promise<boolean> {
    try {
      const result: PAYWALL_RESULT = await RevenueCatUI.presentPaywall();
      switch (result) {
        case PAYWALL_RESULT.PURCHASED:
        case PAYWALL_RESULT.RESTORED:
          return true;
        default:
          return false;
      }
    } catch (error) {
       if (__DEV__) console.warn('Error presenting paywall:', error);
       return false;
    }
  }

  /**
   * Present the paywall only if the user does NOT have the entitlement.
   * Returns true if a purchase or restore was made.
   */
  async presentPaywallIfNeeded(): Promise<boolean> {
    try {
      const result: PAYWALL_RESULT = await RevenueCatUI.presentPaywallIfNeeded({
        requiredEntitlementIdentifier: ENTITLEMENT_ID,
      });
      switch (result) {
        case PAYWALL_RESULT.PURCHASED:
        case PAYWALL_RESULT.RESTORED:
          return true;
        default:
          return false;
      }
    } catch (error) {
      if (__DEV__) console.warn('Error presenting paywall:', error);
      return false;
    }
  }

  /**
   * Present the RevenueCat Customer Center for subscription management.
   */
  async presentCustomerCenter(): Promise<void> {
    try {
      await RevenueCatUI.presentCustomerCenter({
        callbacks: {
          onRestoreStarted: () => {
            if (__DEV__) console.log('Customer Center: restore started');
          },
          onRestoreCompleted: ({ customerInfo }) => {
            if (__DEV__) console.log('Customer Center: restore completed', this.hasPremium(customerInfo));
          },
          onRestoreFailed: ({ error }) => {
            if (__DEV__) console.warn('Customer Center: restore failed', error);
          },
          onShowingManageSubscriptions: () => {
            if (__DEV__) console.log('Customer Center: showing manage subscriptions');
          },
          onFeedbackSurveyCompleted: ({ feedbackSurveyOptionId }) => {
            if (__DEV__) console.log('Customer Center: feedback survey completed', feedbackSurveyOptionId);
          },
        },
      });
    } catch (error) {
      if (__DEV__) console.warn('Error presenting Customer Center:', error);
    }
  }

  /**
   * Restore previous purchases. Returns true if premium is restored.
   */
  async restorePurchases(): Promise<boolean> {
    try {
      const customerInfo = await Purchases.restorePurchases();
      return this.hasPremium(customerInfo);
    } catch {
      return false;
    }
  }

  /**
   * Listen for customer info updates (entitlement changes).
   */
  onCustomerInfoUpdated(callback: (isPremium: boolean) => void): void {
    Purchases.addCustomerInfoUpdateListener((info) => {
      callback(this.hasPremium(info));
    });
  }

  /**
   * Check if CustomerInfo has the kwaii_pro entitlement.
   */
  private hasPremium(customerInfo: CustomerInfo): boolean {
    return (
      customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined
    );
  }
}

export const PurchaseService = new PurchaseServiceClass();
export { PAYWALL_RESULT };
