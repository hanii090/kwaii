import { Redirect } from 'expo-router';

// Placeholder screen — the tab button intercepts and opens the modal instead.
// If somehow navigated to directly, redirect to home.
export default function AddPlaceholder() {
  return <Redirect href="/" />;
}
