'use client';

import { Text, View } from 'react-native';
import { type LeagueMember } from '~/types/leagueMembers';
import ColorRow from '~/components/shared/colorRow';

interface DraftOrderProps {
  leagueMembers?: { members: LeagueMember[]; loggedIn?: LeagueMember };
  membersWithPicks?: { member: LeagueMember; castawayFullName: string }[];
  onTheClock?: (LeagueMember & { loggedIn: boolean }) | null;
}

export default function DraftOrder({
  leagueMembers,
  membersWithPicks,
  onTheClock
}: DraftOrderProps) {
  if (!leagueMembers?.members) {
    return (
      <View className='w-full rounded-lg bg-card p-4'>
        <Text className='text-card-foreground text-lg font-bold'>Loading...</Text>
      </View>
    );
  }

  return (
    <View className='w-full rounded-lg bg-card p-4'>
      <Text className='text-card-foreground mb-4 text-lg font-bold'>Draft Order</Text>
      <View className='gap-2'>
        {leagueMembers.members.map((pick, index) => {
          const isOnTheClock = onTheClock?.memberId === pick.memberId;
          const memberPick = membersWithPicks?.find(m => m.member.memberId === pick.memberId);

          return (
            <ColorRow
              key={pick.memberId}
              className={isOnTheClock ? 'opacity-75' : ''}
              color={pick.color}
              loggedIn={leagueMembers.loggedIn?.displayName === pick.displayName}>
              <Text className='text-lg font-bold text-white'>{index + 1}</Text>

              <Text className='flex-1 text-xl font-semibold text-white'>{pick.displayName}</Text>

              {isOnTheClock && (
                <View className='items-center'>
                  <Text className='animate-pulse text-sm font-medium text-white'>Picking...</Text>
                </View>
              )}

              {memberPick && (
                <Text className='flex-1 text-right text-sm text-white'>
                  {memberPick.castawayFullName}
                </Text>
              )}
            </ColorRow>
          );
        })}
      </View>
    </View>
  );
}
