import { View, Text } from 'react-native';
import Carousel, { Pagination } from 'react-native-reanimated-carousel';
import { usePredictionHistory } from '~/hooks/leagues/query/usePredictionHistory';
import { useCarousel } from '~/hooks/ui/useCarousel';
import SearchableSelect from '~/components/common/searchableSelect';
import ColorRow from '~/components/shared/colorRow';
import PredictionTable from '~/components/leagues/hub/activity/predictionHistory/table';

export default function PredictionHistory() {
  const {
    league,
    carouselData,
    stats,
    memberOptions,
    selectedMemberId,
    setSelectedMemberId,
    hasData,
    isSingleEpisode,
    keyEpisodes,
  } = usePredictionHistory();

  const { ref, props, progressProps, setCarouselData } = useCarousel(carouselData);

  // Reset carousel when member changes
  const handleMemberChange = (memberId: number) => {
    setSelectedMemberId(memberId);
    setCarouselData(carouselData);
  };

  if (!hasData) return null;

  // Single episode - simpler layout without carousel
  if (isSingleEpisode && carouselData[0]) {
    const { episode, predictions } = carouselData[0];

    return (
      <View className='rounded-xl border-2 border-primary/20 bg-card p-2 gap-2 w-full'>
        {/* Header */}
        <View className='flex-row items-center gap-2 px-1'>
          <View className='h-6 w-1 rounded-full bg-primary' />
          <Text className='text-xl font-black uppercase tracking-tight text-foreground'>
            Prediction History
          </Text>
        </View>

        {/* Stats */}
        <View className='flex-row justify-center gap-4 px-1'>
          <Text className='text-sm text-muted-foreground'>
            Accuracy:{' '}
            <Text className='font-bold text-foreground'>
              {stats.count.correct}/{stats.count.total}
            </Text>
          </Text>
          <Text className='text-sm text-muted-foreground'>
            Points:{' '}
            <Text className='font-bold text-foreground'>
              {stats.points.earned}/{stats.points.possible}
            </Text>
          </Text>
        </View>

        {/* Episode Card */}
        <View className='rounded-lg border-2 border-primary/20 bg-accent/50 overflow-hidden'>
          <View className='bg-primary/10 py-2'>
            <Text className='text-xl font-bold uppercase tracking-wider text-foreground text-center'>
              Episode {episode}
            </Text>
          </View>
          <PredictionTable
            predictions={predictions}
            previousEpisodeNumber={keyEpisodes?.previousEpisode?.episodeNumber ?? 0}
            seasonId={league!.seasonId} />
        </View>
      </View>
    );
  }

  return (
    <View className='rounded-xl border-2 border-primary/20 bg-card gap-2 pt-2 w-full'>
      {/* Header */}
      <View className='flex-row items-center gap-2 px-3'>
        <View className='h-6 w-1 rounded-full bg-primary' />
        <Text className='text-xl font-black uppercase tracking-tight text-foreground'>
          Prediction History
        </Text>
      </View>

      <SearchableSelect
        className='w-2/3 mx-auto'
        options={memberOptions.map((m) => ({
          value: m.value,
          label: m.label,
          renderLabel: () => (
            <ColorRow color={m.color} className='w-min px-1'>
              <Text className='text-foreground'>{m.label}</Text>
            </ColorRow>
          ),
        }))}
        selectedValue={selectedMemberId}
        onSelect={handleMemberChange}
        placeholder='Select Member' />
      {/* Stats & Member Selector */}
      <View className='gap-2 px-1'>
        <View className='flex-row justify-center gap-4'>
          <Text className='text-sm text-muted-foreground'>
            Accuracy:{' '}
            <Text className='font-bold text-foreground'>
              {stats.count.correct}/{stats.count.total}
            </Text>
          </Text>
          <Text className='text-sm text-muted-foreground'>
            Points:{' '}
            <Text className='font-bold text-foreground'>
              {stats.points.earned}/{stats.points.possible}
            </Text>
          </Text>
        </View>
      </View>

      {/* Carousel */}
      <Carousel
        ref={ref}
        {...props}
        height={170}
        renderItem={({ item }) => (
          <View className='flex-1 rounded-lg border-2 border-primary/20 bg-accent/50 overflow-hidden mr-2.5 ml-1.5'>
            <View className='bg-primary/10 h-6'>
              <Text
                allowFontScaling={false}
                className='text-xl font-bold uppercase tracking-wider text-foreground text-center'>
                Episode {item.episode}
              </Text>
            </View>
            <PredictionTable
              predictions={item.predictions}
              previousEpisodeNumber={keyEpisodes?.previousEpisode?.episodeNumber ?? 0}
              seasonId={league!.seasonId} />
          </View>
        )}
        loop={false} />

      {/* Pagination */}
      <View className='items-center'>
        <Pagination.Basic {...progressProps} containerStyle={{ marginBottom: 4 }} />
      </View>
    </View>
  );
}
