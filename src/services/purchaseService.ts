import Purchases, {
  PurchasesOffering,
  CustomerInfo,
  LOG_LEVEL,
} from 'react-native-purchases';
import { Platform } from 'react-native';

// ⚠️ Replace these with your real RevenueCat API keys
const REVENUECAT_IOS_API_KEY = 'appl_YOUR_IOS_API_KEY_HERE';
const REVENUECAT_ANDROID_API_KEY = 'goog_YOUR_ANDROID_API_KEY_HERE';

// The entitlement identifier you set up in RevenueCat dashboard
const PREMIUM_ENTITLEMENT_ID = 'premium';

class PurchaseServiceClass {
  private initialized = false;

  /**
   * Initialize RevenueCat SDK. Call once on app start.
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    const apiKey =
      Platform.OS === 'ios'
        ? REVENUECAT_IOS_API_KEY
        : REVENUECAT_ANDROID_API_KEY;

    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }

    Purchases.configure({ apiKey });
    this.initialized = true;
  }

  /**
   * Check if the user currently has the premium entitlement.
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
   * Get the current offering (contains the $3.99 product).
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
   * Purchase the premium product. Returns true if successful.
   */
  async purchasePremium(): Promise<boolean> {
    try {
      const offerings = await Purchases.getOfferings();
      const currentOffering = offerings.current;

      if (!currentOffering || currentOffering.availablePackages.length === 0) {
        throw new Error('No offerings available');
      }

      // Use the first available package (should be the $3.99 lifetime product)
      const pkg = currentOffering.lifetime ?? currentOffering.availablePackages[0];
      const { customerInfo } = await Purchases.purchasePackage(pkg);

      return this.hasPremium(customerInfo);
    } catch (error: any) {
      // User cancelled
      if (error.userCancelled) return false;
      throw error;
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
   * Check if CustomerInfo has the premium entitlement.
   */
  private hasPremium(customerInfo: CustomerInfo): boolean {
    return (
      customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID] !== undefined
    );
  }
}

export const PurchaseService = new PurchaseServiceClass();
