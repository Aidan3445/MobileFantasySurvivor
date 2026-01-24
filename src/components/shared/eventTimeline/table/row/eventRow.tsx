import { View, Text, Pressable } from 'react-native';
import { useMemo, useState } from 'react';
import { cn } from '~/lib/utils';
import ColorRow from '~/components/shared/colorRow';
import PointsCell from '~/components/shared/eventTimeline/table/row/pointsCell';
import NotesCell from '~/components/shared/eventTimeline/table/row/notesCell';
import { type EnrichedEvent, type BaseEventName } from '~/types/events';
import { BaseEventFullName } from '~/lib/events';
import EditEvent from '~/components/leagues/actions/events/edit';
import { useEventLabel } from '~/hooks/helpers/useEventLabel';
import CastawayModal from '~/components/shared/castaways/castawayModal';
import Modal from '~/components/common/modal';

interface EventRowProps {
  className?: string;
  event: EnrichedEvent;
  editCol?: boolean;
  isMock?: boolean;
  noTribes?: boolean;
  noMembers?: boolean;
  noPoints?: boolean;
}

export default function EventRow({
  className,
  event,
  editCol: edit,
  isMock,
  noTribes,
  noMembers,
  noPoints,
}: EventRowProps) {
  const isBaseEvent = useMemo(() => event.eventSource === 'Base', [event.eventSource]);
  const label = useEventLabel(event.eventName, isBaseEvent, event.label);

  // State for secondary picks modal
  const [secondaryModalVisible, setSecondaryModalVisible] = useState(false);
  const [secondaryModalMembers, setSecondaryModalMembers] = useState<
    Array<{ memberId: number; displayName: string; color: string }>
  >([]);

  const openSecondaryModal = (
    secondaries: Array<{ memberId: number; displayName: string; color: string }>
  ) => {
    setSecondaryModalMembers(secondaries);
    setSecondaryModalVisible(true);
  };

  return (
    <View className={cn('flex-row items-center gap-4 border-b border-primary/10 bg-card px-4 py-2', className)}>
      {/* Edit Column */}
      {edit ? (
        isMock ? (
          <View className='w-12' />
        ) : (
          <View className='w-12'>
            <EditEvent event={event} />
          </View>
        )
      ) : null}

      {/* Event Name */}
      <View className='flex-1 max-w-40'>
        {isBaseEvent && (
          <Text className='text-xs text-muted-foreground'>
            {BaseEventFullName[event.eventName as BaseEventName]}
          </Text>
        )}
        <Text className='text-base text-foreground'>{label}</Text>
      </View>

      {/* Points */}
      {!noPoints && <PointsCell points={event.points} />}

      {/* Tribes */}
      {!noTribes && (
        <View className='w-24 justify-center gap-0.5'>
          {event.referenceMap?.map(({ tribe }, index) =>
            tribe ? (
              <ColorRow key={index} className='leading-tight' color={tribe.tribeColor}>
                <Text className='text-base text-foreground'>
                  {tribe.tribeName}
                </Text>
              </ColorRow>
            ) : null
          )}
        </View>
      )}

      {/* Castaways */}
      <View className='w-32 items-end justify-center gap-0.5'>
        {event.referenceMap?.map(({ pairs }) =>
          pairs.map(({ castaway }) => (
            <ColorRow
              key={castaway.castawayId}
              className='leading-tight'
              color={castaway.tribe?.color ?? '#AAAAAA'}>
              <CastawayModal castaway={castaway}>
                <Text className='text-base text-foreground'>{castaway.shortName}</Text>
              </CastawayModal>
            </ColorRow>
          ))
        )}
      </View>

      {/* Members */}
      {!noMembers && (
        <View className='min-w-[120px] flex-1 justify-center gap-0.5'>
          {event.referenceMap?.map(({ pairs }, index) =>
            pairs.map(({ castaway, member, secondaries }) => (
              <View
                key={`${castaway.castawayId}-${index}`}
                className='flex-row items-center gap-1'>
                {member ? (
                  <ColorRow className='leading-tight' color={member.color}>
                    {member.displayName}
                  </ColorRow>
                ) : (
                  <ColorRow
                    color='#CCCCCC'
                    className={cn(
                      'leading-tight text-muted-foreground',
                      (secondaries?.length === 0 || !event.points) && 'opacity-0'
                    )}>
                    None
                  </ColorRow>
                )}
                {secondaries && secondaries.length > 0 && !!event.points && (
                  <Pressable
                    onPress={() => openSecondaryModal(secondaries)}
                    className='rounded border border-primary/20 px-1'>
                    <Text className='text-xs text-muted-foreground'>
                      2<Text className='text-[10px]'>nd</Text>
                    </Text>
                  </Pressable>
                )}
              </View>
            ))
          )}
        </View>
      )}

      {/* Notes */}
      <NotesCell notes={event.notes} />

      {/* Secondary Picks Modal */}
      <Modal isVisible={secondaryModalVisible} onClose={() => setSecondaryModalVisible(false)}>
        <Text className='text-center text-lg font-semibold uppercase tracking-wide'>
          Secondary Points
        </Text>
        <View className='mt-2 gap-1'>
          {secondaryModalMembers.map((secMember) => (
            <ColorRow
              key={`secondary-${secMember.memberId}`}
              className='leading-tight'
              color={secMember.color}>
              {secMember.displayName}
            </ColorRow>
          ))}
        </View>
      </Modal>
    </View>
  );
}
