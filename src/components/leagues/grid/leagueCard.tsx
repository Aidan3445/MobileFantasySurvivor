import { Link } from 'expo-router';
import { FlameKindling } from 'lucide-react-native';
import { Text, View } from 'react-native';
import Button from '~/components/common/button';
import { type CurrentSelection, type LeagueMember } from '~/types/leagueMembers';
import { type League } from '~/types/leagues';

interface LeagueCardProps {
  league: League;
  member: LeagueMember;
  currentSelection: CurrentSelection;
}

export default function LeagueCard({ league, member, currentSelection }: LeagueCardProps) {
  return (
    <Link
      key={league.hash}
      href={{ pathname: '/leagues/[hash]', params: { hash: league.hash } }}
      asChild>
      <Button className='mb-3 flex-col rounded-lg bg-card p-4'>
        <Text className='text-xl font-semibold text-card-foreground'>{league.name}</Text>
        <Text className='mt-1 text-sm text-muted-foreground'>{league.season}</Text>
        {currentSelection ? (
          <View className='mt-2 flex-row items-center'>
            <Text className='italic text-foreground'>{currentSelection.fullName}</Text>
            {currentSelection.isEliminated && (
              <FlameKindling
                size={16}
                color='#ef4444'
                className='ml-1'
              />
            )}
          </View>
        ) : (
          <Text className='mt-2 italic text-muted-foreground'>Yet to draft</Text>
        )}
        <View
          className='mt-3 items-center justify-center rounded-full py-1.5'
          style={{ backgroundColor: member.color }}>
          <Text className='font-semibold text-white'>{member.displayName}</Text>
        </View>
      </Button>
    </Link>
  );
}
