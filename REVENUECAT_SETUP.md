# RevenueCat & Payments Setup Guide

This guide details how to configure RevenueCat, the App Store, and Google Play Console for your app's in-app purchases.

## Phase 1: RevenueCat Dashboard Setup

1. **Create Project:**
   * Go to [RevenueCat Dashboard](https://app.revenuecat.com/).
   * Create a new project named "Kawaii Meds".

2. **Add Your Apps:**
   * **iOS:**
     * Select "App Store".
     * Enter Bundle ID: `com.kawaiimeds.app` (from `app.json`).
     * **App Store Connect Shared Secret:** You will need to generate this in App Store Connect (Users and Access -> Integrations -> In-App Purchase) and paste it here.
   * **Android:**
     * Select "Play Store".
     * Enter Package Name: `com.kawaiimeds.app` (from `app.json`).
     * **Service Account JSON:** Follow RevenueCat's guide to create a Google Play Service Account with financial permissions and upload the JSON key.

3. **Create Products (RevenueCat):**
   * Go to **Products**.
   * Create a new product.
   * **Identifier:** `kawaii_premium_lifetime` (This must match what you create in Apple/Google stores exactly).
   * Set the store identifier for both iOS and Android to `kawaii_premium_lifetime`.

4. **Create Entitlement:**
   * Go to **Entitlements**.
   * Create a new entitlement.
   * **Identifier:** `kwaii_pro` (**Crucial:** This must match `ENTITLEMENT_ID` in `src/services/purchaseService.ts`).
   * Attach the product you created (`kawaii_premium_lifetime`) to this entitlement.

5. **Create Offering:**
   * Go to **Offerings**.
   * Create a new offering (or use the default one).
   * **Identifier:** `default`.
   * Add a package (e.g., "Lifetime").
   * Attach the product (`kawaii_premium_lifetime`) to this package.

6. **Get Public API Keys:**
   * Go to **Project Settings** -> **API Keys**.
   * Copy the **iOS Key** (starts with `appl_`).
   * Copy the **Android Key** (starts with `goog_`).

## Phase 2: Store Setup

### App Store Connect (iOS)

1. Go to **App Store Connect** -> **My Apps** -> **Kawaii Meds**.
2. Go to **Monetization** -> **In-App Purchases**.
3. Click **(+)** to add a new IAP.
4. **Type:** Non-Consumable (for lifetime) or Auto-Renewable Subscription.
5. **Reference Name:** Lifetime Premium.
6. **Product ID:** `kawaii_premium_lifetime`.
7. **Pricing:** Select a tier (e.g., Tier 5 for ~$4.99).
8. **App Store Information:** Add Display Name ("Kawaii Premium") and Description.
9. **Review:** You must take a screenshot of your paywall/shop screen and upload it here for review.

### Google Play Console (Android)

1. Go to **Google Play Console** -> **Kawaii Meds**.
2. Go to **Monetize** -> **Products** -> **In-app products**.
3. Click **Create product**.
4. **Product ID:** `kawaii_premium_lifetime`.
5. **Product details:** Enter Name and Description.
6. **Price:** Set the price.
7. **Status:** Activate the product.

## Phase 3: Project Configuration

### 1. Update `.env`

You need to manually update your `.env` file with the keys from Phase 1.

**Action Required:** Open `.env` and paste your keys:

```bash
# Production RevenueCat Keys
EXPO_PUBLIC_REVENUECAT_IOS_API_KEY=appl_YOUR_ACTUAL_KEY_HERE
EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY=goog_YOUR_ACTUAL_KEY_HERE

# Legacy test key (can be removed or commented out)
# EXPO_PUBLIC_REVENUECAT_API_KEY=...
```

### 2. Verify Code

The `src/services/purchaseService.ts` file has already been updated to use these new environment variables and the `kwaii_pro` entitlement ID.

### 3. Build & Test

* **Expo Go:** RevenueCat often works in "Sandbox" mode on Expo Go if configured correctly, but native payments require a development build.
* **Development Build:** Run `npx expo run:ios` or `npx expo run:android` to test real payment flows (using Sandbox accounts for Apple/Google).
