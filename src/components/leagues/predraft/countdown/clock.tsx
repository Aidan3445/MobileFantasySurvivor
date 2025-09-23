import { type ReactNode, useEffect, useState } from 'react';
import { View, Text } from 'react-native';

interface ClockProps {
  endDate: Date | null;
  replacedBy?: ReactNode;
}

export default function Clock({ endDate, replacedBy }: ClockProps) {
  const [timer, setTimer] = useState<number | null>(null);

  useEffect(() => {
    if (!endDate && timer !== null) {
      setTimer(null);
      return;
    }
    if (!endDate || (timer !== null && timer <= 0)) return;
    if (timer === null) setTimer(endDate.getTime() - Date.now());

    // eslint-disable-next-line no-undef
    const interval = setInterval(() => {
      setTimer(endDate.getTime() - Date.now());
    }, 1000);

    // eslint-disable-next-line no-undef
    return () => clearInterval(interval);
  }, [endDate, timer]);

  const days = timer ? Math.floor(timer / (1000 * 60 * 60 * 24)) : '--';
  const hours = timer ? Math.floor((timer / (1000 * 60 * 60)) % 24) : '--';
  const minutes = timer ? Math.floor((timer / (1000 * 60)) % 60) : '--';
  const seconds = timer ? Math.floor((timer / 1000) % 60) : '--';

  return !timer || timer > 0 ? (
    <View className='w-full flex-row justify-evenly'>
      <ClockPlace value={days.toString()} label={days === 1 ? 'Day' : 'Days'} />
      <Text className='text-4xl text-navigation'>:</Text>
      <ClockPlace
        value={hours.toString()}
        label={hours === 1 ? 'Hour' : 'Hours'}
      />
      <Text className='text-4xl text-navigation'>:</Text>
      <ClockPlace
        value={minutes.toString()}
        label={minutes === 1 ? 'Minute' : 'Minutes'}
      />
      <Text className='text-4xl text-navigation'>:</Text>
      <ClockPlace
        value={seconds.toString()}
        label={seconds === 1 ? 'Second' : 'Seconds'}
      />
    </View>
  ) : (
    replacedBy
  );
}

interface ClockPlaceProps {
  value: string;
  label: string;
}

function ClockPlace({ value, label }: ClockPlaceProps) {
  return (
    <View className='items-center'>
      <Text className='text-4xl font-bold text-navigation'>{value}</Text>
      <Text className='text-xs text-muted'>{label}</Text>
    </View>
  );
}
