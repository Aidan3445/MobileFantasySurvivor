import { useClerk } from '@clerk/clerk-expo';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';

export default function SignOutButton() {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk();
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      queryClient.clear();
      // Redirect to your desired page
      router.replace('/(auth)/sign-in');
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <TouchableOpacity onPress={handleSignOut}>
      <Text>Sign out</Text>
    </TouchableOpacity>
  );
}
