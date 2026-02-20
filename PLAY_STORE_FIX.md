# Google Play Console — Fix "Organization Account" Rejection

Your app was rejected because Google thinks it's a **Medical** app, which requires an Organization developer account. Since you have a **Personal** account, you need to change the category and declarations.

## Step 1: Change App Category

1. Open [Google Play Console](https://play.google.com/console)
2. Select your app **Kawaii Pills**
3. Go to **Grow** → **Store presence** → **Main store listing** (or **Store settings**)
4. Find **App category**
5. Change it to:
   - **Application type:** Application
   - **Category:** **Health & Fitness** (NOT "Medical")
6. Click **Save**

> "Medical" requires an Organization account. "Health & Fitness" does not.

## Step 2: Update App Content Declarations

Go to **Policy and programs** → **App content**. You need to review each section:

### a) Health Apps

1. Click **Health apps** → **Manage** (or **Start**)
2. When asked "Is this a health app?":
   - Select **Yes**
3. When asked what type:
   - **DO NOT** check "Medical device" or "Medical app"
   - **DO** check **"Health and fitness tracking"** (or similar non-medical option)
4. If asked "Does your app provide medical advice?":
   - Select **No**
5. If asked "Is your app a regulated medical device?":
   - Select **No**
6. Click **Save**

### b) Data Safety

1. Click **Data safety** → **Manage**
2. Fill out the form honestly:
   - **Does your app collect or share user data?** → **No** (all data is local)
   - If it asks about health data: your app stores medication names locally but does NOT transmit them
3. Click **Save** and **Submit**

### c) Privacy Policy

1. Click **App access** → **Manage**
2. Select **All functionality is available without special access**
3. Click **Save**

Then go to **Store presence** → **Main store listing**:
4. In the **Privacy policy URL** field, enter:
   ```
   https://hanii090.github.io/kwaii/privacy/
   ```
5. Click **Save**

### d) Ads Declaration

1. Click **Ads** → **Manage**
2. Select **No, my app does not contain ads**
3. Click **Save**

### e) Content Rating

1. Click **Content rating** → **Manage**
2. Click **Start questionnaire**
3. Select **Utility, Productivity, Communication, or Other**
4. Answer all questions honestly (no violence, no sexual content, etc.)
5. Click **Save** → **Submit**

### f) Target Audience

1. Click **Target audience and content** → **Manage**
2. Select target age: **18 and over** (safest for health apps)
3. Confirm your app is NOT designed for children
4. Click **Save**

### g) News Apps (if shown)

1. Select **No, my app is not a news app**
2. Click **Save**

### h) Government Apps (if shown)

1. Select **No**
2. Click **Save**

## Step 3: Review Store Listing

Go to **Grow** → **Store presence** → **Main store listing** and verify:

- **App name:** Kawaii Pills
- **Short description:** Your adorable pill reminder with a virtual pet companion
- **Full description:** (your existing description)
- **App icon:** uploaded
- **Feature graphic:** uploaded (1024x500)
- **Screenshots:** at least 2 phone screenshots
- **Privacy policy URL:** `https://hanii090.github.io/kwaii/privacy/`
- **Category:** Health & Fitness
- **Contact email:** your email

## Step 4: Resubmit

1. Go to **Publishing overview**
2. Review all changes
3. Click **Send changes for review**

The review typically takes 1-3 days. With the category changed to "Health & Fitness" and no medical claims, it should pass.

## Important Reminders

- **NEVER** select "Medical" as your category with a Personal account
- **NEVER** claim your app is a medical device or provides medical advice
- Your app is a **reminder tool with gamification**, not a medical service
- Your Terms of Service already includes a "Not Medical Advice" disclaimer
