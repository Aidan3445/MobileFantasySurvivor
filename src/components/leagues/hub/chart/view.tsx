import { Fragment, useMemo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { CartesianChart, Line } from 'victory-native';
import { type AnimatedProp, Circle, RoundedRect, Text as SkiaText, useFont } from '@shopify/react-native-skia';
import { useLeagueData } from '~/hooks/leagues/enrich/useLeagueData';
import { colors } from '~/lib/colors';
import { cn } from '~/lib/utils';
import { Pointer } from 'lucide-react-native';

const Font = require('~/assets/fonts/segoe-ui-semibold.ttf');

type ChartDataPoint = {
  episode: number;
  [memberName: string]: number;
};

export default function Chart() {
  const { sortedMemberScores, league } = useLeagueData();
  const startWeek = league?.startWeek ?? 1;
  const font = useFont(Font, 14);
  const labelFont = useFont(Font, 16);

  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  const { chartData, yKeys, memberColors, maxY, minY, maxEpisode } = useMemo(() => {
    const memberColors: Record<string, string> = {};
    let maxY = 0;
    let minY = 0;

    const yKeys = sortedMemberScores.map(({ member }) => {
      memberColors[member.displayName] = member.color;
      return member.displayName;
    });

    let maxEpisode = startWeek;
    sortedMemberScores.forEach(({ scores }) => {
      scores.forEach((score, ep) => {
        if (ep >= startWeek) {
          maxEpisode = Math.max(maxEpisode, ep);
          maxY = Math.max(maxY, score);
          minY = Math.min(minY, score);
        }
      });
    });

    const chartData: ChartDataPoint[] = [];

    const episode0: ChartDataPoint = { episode: 0 };
    yKeys.forEach((key) => (episode0[key] = 0));
    chartData.push(episode0);

    for (let ep = startWeek; ep <= maxEpisode; ep++) {
      const point: ChartDataPoint = { episode: ep };
      sortedMemberScores.forEach(({ member, scores }) => {
        point[member.displayName] = scores[ep] ?? 0;
      });
      chartData.push(point);
    }

    return { chartData, yKeys, memberColors, maxY, minY, maxEpisode };
  }, [sortedMemberScores, startWeek]);

  const handleLegendPress = (memberName: string) => {
    setSelectedMember((prev) => (prev === memberName ? null : memberName));
  };

  const getOpacity = (memberName: string) => {
    if (!selectedMember) return 0.5;
    return memberName === selectedMember ? 1 : 0.15;
  };

  // Empty state
  if (sortedMemberScores[0]?.scores?.[startWeek] === undefined) {
    return (
      <View className='w-full h-64 items-center justify-center rounded-lg bg-card'>
        <Text className='text-muted-foreground'>
          No scores available to display the chart.
        </Text>
      </View>
    );
  }

  return (
    <View className='w-full rounded-lg bg-card'>
      <View style={{ height: 260 }}>
        <CartesianChart
          data={chartData}
          xKey='episode'
          yKeys={yKeys}
          domain={{
            y: [minY, maxY],
            x: [0, maxEpisode],
          }}
          domainPadding={{ top: 25, right: 15 }}
          axisOptions={{
            font,
            tickCount: { x: maxEpisode + 1, y: 6 },
            labelColor: colors.primary,
            lineColor: colors.secondary,
            formatXLabel: (value) => (value === 0 ? '' : String(value)),
          }}>
          {({ points }) => (
            <>
              {yKeys.map((key) => (
                <Line
                  key={key}
                  points={points[key]!}
                  color={memberColors[key]}
                  strokeWidth={selectedMember === key ? 6 : 5}
                  opacity={getOpacity(key)}
                  curveType='natural'
                  animate={{ type: 'timing', duration: 200 }} />
              ))}

              {/* End markers */}
              {yKeys.map((key) => {
                const pts = points[key];
                const lastPoint = pts?.[pts.length - 1];
                if (!lastPoint || lastPoint.x === 0) return null;
                return (
                  <Circle
                    key={`${key}-marker`}
                    cx={lastPoint.x}
                    cy={lastPoint.y as AnimatedProp<number>}
                    r={selectedMember === key ? 7 : 5}
                    color={memberColors[key]}
                    opacity={getOpacity(key) + 0.5} />
                );
              })}

              {/* Score labels for selected member */}
              {selectedMember &&
                labelFont &&
                points[selectedMember]?.map((point, index) => {
                  if (index === 0) return null;
                  const score = chartData[index]?.[selectedMember];
                  if (score === undefined) return null;

                  const text = String(score);
                  const textWidth = text.length * 8;
                  const textHeight = 14;
                  const padding = 4;
                  const x = point.x - textWidth / 2;
                  const y = (point.y as unknown as number) - 12;
                  return (
                    <Fragment key={`label-${index}`}>
                      <RoundedRect
                        x={x - padding}
                        y={y - textHeight}
                        width={textWidth + padding * 2}
                        height={textHeight + padding}
                        r={4}
                        color={colors.card}
                        opacity={0.75} />
                      <SkiaText
                        x={x}
                        y={y}
                        text={text}
                        font={labelFont}
                        color={colors.primary} />
                    </Fragment>
                  );
                })}
            </>
          )}
        </CartesianChart>
      </View>

      {/* Interactive Legend */}
      <View className='flex-row flex-wrap gap-2 px-2 pt-2 items-center'>
        {sortedMemberScores.map(({ member }) => {
          const isSelected = selectedMember === member.displayName;
          const isOther = selectedMember && !isSelected;

          return (
            <Fragment key={member.displayName}>
              {member.loggedIn && (
                <View
                  className='-mr-2 rotate-90 animate-pulse'>
                  <Pointer size={16} color={colors.primary} />
                </View>
              )}
              <Pressable
                onPress={() => handleLegendPress(member.displayName)}
                className='flex-row items-center gap-1 py-1 active:opacity-70'>
                <View
                  className={cn(
                    'w-4 h-4 rounded-full border border-primary',
                    isOther && 'opacity-30',
                  )}
                  style={{ backgroundColor: member.color }} />
                <View className={cn('px-0.5',
                  isSelected && 'bg-primary/30 rounded')}>
                  <Text
                    className={cn(
                      'text-base transition-all',
                      isOther ? 'text-muted-foreground' : 'text-primary'
                    )}>
                    {member.displayName.split(' ')[0]}
                  </Text>
                </View>
              </Pressable>
            </Fragment>
          );
        })}
      </View>
    </View>
  );
}
