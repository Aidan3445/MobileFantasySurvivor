import { View, Text, Pressable } from 'react-native';
import { useState } from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react-native';
import { type LeagueMember } from '~/types/leagueMembers';
import ColorRow from '~/components/shared/colorRow';
import PointsCell from '~/components/shared/eventTimeline/table/row/pointsCell';
import Modal from '~/components/common/modal';

interface StreakRowProps {
  streakPointValue: number;
  members: LeagueMember[];
  streaksMap: Record<number, Record<number, number>>; // memberId -> episodeNumber -> streakCount
  episodeNumber: number;
  shotInTheDarkStatus?: Record<
    number,
    { episodeNumber: number; status: 'pending' | 'saved' | 'wasted' } | null
  >;
}

export default function StreakRow({
  streakPointValue,
  members,
  streaksMap,
  episodeNumber,
  shotInTheDarkStatus,
}: StreakRowProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState<LeagueMember | null>(null);

  const openMemberModal = (member: LeagueMember) => {
    setSelectedMember(member);
    setModalVisible(true);
  };

  const selectedShotStatus = selectedMember
    ? shotInTheDarkStatus?.[selectedMember.memberId]
    : null;
  const selectedShotUsedThisEpisode = selectedShotStatus?.episodeNumber === episodeNumber;

  return (
    <View className='flex-row items-center gap-4 border-b border-primary/10 bg-card px-4 py-2'>
      {/* Event Name (sr-only equivalent - hidden) */}
      <View className='flex-1 max-w-40'>
        <Text className='text-sm text-muted-foreground'>Streak Bonus</Text>
      </View>

      {/* Points */}
      <PointsCell points={streakPointValue} />

      {/* Members */}
      <View className='flex-1 flex-row flex-wrap gap-2'>
        {members.map((member) => {
          const shotStatus = shotInTheDarkStatus?.[member.memberId];
          const shotUsedThisEpisode = shotStatus?.episodeNumber === episodeNumber;

          return (
            <Pressable key={member.memberId} onPress={() => openMemberModal(member)}>
              <ColorRow className='flex-row items-center gap-1 text-sm font-medium' color={member.color}>
                <Text className='text-sm'>{member.displayName}</Text>
                {shotUsedThisEpisode && shotStatus.status === 'saved' && (
                  <ShieldCheck size={16} color='#16a34a' />
                )}
                {shotUsedThisEpisode && shotStatus.status === 'wasted' && (
                  <ShieldAlert size={16} color='#dc2626' />
                )}
              </ColorRow>
            </Pressable>
          );
        })}
      </View>

      {/* Member Streak Modal */}
      <Modal isVisible={modalVisible} onClose={() => setModalVisible(false)}>
        <Text className='text-center text-sm font-semibold uppercase tracking-wide'>
          Survival Streak
        </Text>
        <View className='my-2 h-px bg-primary/20' />
        {selectedMember !== null && (
          <>
            <Text className='text-sm'>
              Total streak: {streaksMap[selectedMember.memberId]?.[episodeNumber] ?? 0}
            </Text>
            {selectedShotUsedThisEpisode && (
              <>
                <View className='my-2 h-px bg-primary/20' />
                <View className='flex-row items-center gap-1'>
                  {selectedShotStatus?.status === 'saved' ? (
                    <>
                      <ShieldCheck size={12} color='#16a34a' />
                      <Text className='text-xs font-semibold text-green-600'>
                        Shot in the Dark saved their streak
                      </Text>
                    </>
                  ) : (
                    <>
                      <ShieldAlert size={12} color='#dc2626' />
                      <Text className='text-xs font-semibold text-red-600'>
                        Shot in the Dark was wasted
                      </Text>
                    </>
                  )}
                </View>
              </>
            )}
          </>
        )}
      </Modal>
    </View>
  );
}
