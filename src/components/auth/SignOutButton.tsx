import { useClerk } from '@clerk/clerk-expo';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';

export default function SignOutButton() {
  const { signOut } = useClerk();
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      queryClient.clear();
      router.replace('/(auth)/sign-in');
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <TouchableOpacity onPress={handleSignOut}>
      <Text>Sign out</Text>
    </TouchableOpacity>
  );
}
