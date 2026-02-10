import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  format,
  addDays,
  startOfDay,
  isSameDay,
  isBefore,
  getMonth,
} from 'date-fns';
import { colors, typography } from '../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DAY_WIDTH = 52;
const DAYS_TO_SHOW = 60;
const EDGE_BLOCK_WIDTH = 44;
const MONTH_LABEL_HEIGHT = 20;

interface DateSelectorProps {
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  onDateSelect,
  selectedDate: propSelectedDate,
}) => {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [selectedDate, setSelectedDate] = useState<Date>(
    propSelectedDate || today
  );
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollX, setScrollX] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(SCREEN_WIDTH);

  // Generate dates array once
  const dates = useMemo(() => {
    const result: Date[] = [];
    for (let i = -30; i < DAYS_TO_SHOW - 30; i++) {
      result.push(addDays(today, i));
    }
    return result;
  }, [today]);

  // Pre-compute month start flags — static, zero scroll dependency
  const monthStartFlags = useMemo(() => {
    return dates.map((_date, index) => {
      if (index === 0) return true;
      return getMonth(dates[index]) !== getMonth(dates[index - 1]);
    });
  }, [dates]);

  // Compute right padding so max scroll is a clean multiple of DAY_WIDTH
  const { maxScrollX, rightPadding } = useMemo(() => {
    const rawContentWidth =
      dates.length * DAY_WIDTH + EDGE_BLOCK_WIDTH * 2;
    const rawMax = Math.max(0, rawContentWidth - viewportWidth);
    const snappedMax = Math.ceil(rawMax / DAY_WIDTH) * DAY_WIDTH;
    return {
      maxScrollX: snappedMax,
      rightPadding: EDGE_BLOCK_WIDTH + (snappedMax - rawMax),
    };
  }, [dates.length, viewportWidth]);

  useEffect(() => {
    const selectedIndex = dates.findIndex(date =>
      isSameDay(date, selectedDate)
    );
    if (selectedIndex !== -1 && scrollViewRef.current) {
      setTimeout(() => {
        // Center selected date in the visible area between edge blocks
        const idealX =
          EDGE_BLOCK_WIDTH +
          selectedIndex * DAY_WIDTH +
          DAY_WIDTH / 2 -
          viewportWidth / 2;
        const snappedX = Math.round(idealX / DAY_WIDTH) * DAY_WIDTH;
        const targetX = Math.max(0, Math.min(maxScrollX, snappedX));
        scrollViewRef.current?.scrollTo({ x: targetX, animated: false });
      }, 100);
    }
  }, []);

  const handleDatePress = (date: Date) => {
    // Block selection of past dates
    if (isBefore(date, today)) return;
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  // Sticky month label: show when the first visible column's month-start
  // has scrolled out of view (i.e. it is NOT itself a month-start column)
  const stickyMonthLabel = useMemo(() => {
    const firstIdx = Math.max(0, Math.floor(scrollX / DAY_WIDTH));
    if (firstIdx < dates.length && !monthStartFlags[firstIdx]) {
      return format(dates[firstIdx], 'MMM');
    }
    return null;
  }, [scrollX, dates, monthStartFlags]);

  const scrollByDays = (days: number) => {
    const currentSnap = Math.round(scrollX / DAY_WIDTH) * DAY_WIDTH;
    const nextX = Math.max(
      0,
      Math.min(maxScrollX, currentSnap + days * DAY_WIDTH)
    );
    scrollViewRef.current?.scrollTo({ x: nextX, animated: true });
  };

  // Only used for arrow enable/disable — low frequency is fine
  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollX(e.nativeEvent.contentOffset.x);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select date</Text>

      <View style={styles.datePickerContainer}>
        {/* Scrollable content — month labels & boundaries are inline */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingRight: rightPadding },
          ]}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onLayout={(e) => setViewportWidth(e.nativeEvent.layout.width)}
          snapToInterval={DAY_WIDTH}
          decelerationRate="fast"
        >
          {dates.map((date, index) => {
            const isSelected = isSameDay(date, selectedDate);
            const isToday = isSameDay(date, today);
            const isPast = isBefore(date, today);
            const dayOfWeek = format(date, 'EEEEE');
            const dayNumber = format(date, 'd');
            const isNewMonth = monthStartFlags[index];
            const showBoundary = isNewMonth && index !== 0;

            return (
              <View key={index} style={styles.dateColumn}>
                {/* Month boundary line — scrolls natively, zero jitter */}
                {showBoundary && <View style={styles.monthBoundaryLine} />}

                {/* Month label */}
                <View style={styles.monthLabelCell}>
                  {isNewMonth && (
                    <Text style={styles.monthText}>
                      {format(date, 'MMM')}
                    </Text>
                  )}
                </View>

                {/* Date content */}
                <TouchableOpacity
                  style={styles.dateItem}
                  onPress={() => handleDatePress(date)}
                  activeOpacity={isPast ? 1 : 0.7}
                  disabled={isPast}
                >
                  <Text style={[styles.dayOfWeek, isPast && styles.pastText]}>
                    {dayOfWeek}
                  </Text>
                  <View
                    style={[
                      styles.dateCircle,
                      isToday && !isSelected && styles.dateCircleToday,
                      isSelected && styles.dateCircleSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dateNumber,
                        isPast && styles.pastText,
                        isPast && styles.pastDateStrikethrough,
                        isSelected && styles.dateNumberSelected,
                      ]}
                    >
                      {dayNumber}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>

        {/* Sticky month label — dark bg covers peeking inline labels */}
        {stickyMonthLabel && (
          <View pointerEvents="none" style={styles.stickyMonthLabel}>
            <Text style={styles.monthText}>{stickyMonthLabel}</Text>
          </View>
        )}

        {/* Side blocks + arrows */}
        <View pointerEvents="none" style={styles.edgeBlockLeft} />
        <View pointerEvents="none" style={styles.edgeBlockRight} />

        <TouchableOpacity
          style={[styles.arrowLeft, scrollX <= 0 && styles.arrowDisabled]}
          onPress={() => scrollByDays(-7)}
          activeOpacity={0.7}
          disabled={scrollX <= 0}
        >
          <Ionicons name="chevron-back" size={24} color={colors.white} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.arrowRight,
            scrollX >= maxScrollX && styles.arrowDisabled,
          ]}
          onPress={() => scrollByDays(7)}
          activeOpacity={0.7}
          disabled={scrollX >= maxScrollX}
        >
          <Ionicons name="chevron-forward" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dark,
    paddingVertical: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: typography.fontFamilySemiBold,
    color: colors.white,
    marginBottom: 24,
    marginLeft: 20,
  },
  datePickerContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  scrollContent: {
    paddingLeft: EDGE_BLOCK_WIDTH,
  },
  dateColumn: {
    width: DAY_WIDTH,
    alignItems: 'center',
  },
  monthLabelCell: {
    height: MONTH_LABEL_HEIGHT,
    width: DAY_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthText: {
    fontSize: 14,
    fontFamily: typography.fontFamilyMedium,
    color: colors.white,
  },
  monthBoundaryLine: {
    position: 'absolute',
    left: 0,
    top: 2,
    bottom: 0,
    width: 1,
    backgroundColor: colors.lightGray,
    opacity: 0.6,
  },
  dateItem: {
    width: DAY_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  dayOfWeek: {
    fontSize: 12,
    color: colors.lightGray,
    marginBottom: 8,
  },
  dateCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  dateCircleToday: {
    borderWidth: 1,
    borderColor: '#414141',
  },
  dateCircleSelected: {
    backgroundColor: colors.primary,
    borderWidth: 0,
  },
  dateNumber: {
    fontSize: 16,
    fontFamily: typography.fontFamilyMedium,
    color: colors.lightGray,
  },
  dateNumberSelected: {
    color: colors.white,
    fontFamily: typography.fontFamilySemiBold,
  },
  pastText: {
    opacity: 0.35,
  },
  pastDateStrikethrough: {
    textDecorationLine: 'line-through',
  },
  stickyMonthLabel: {
    position: 'absolute',
    left: EDGE_BLOCK_WIDTH,
    top: 0,
    width: DAY_WIDTH,
    height: MONTH_LABEL_HEIGHT,
    backgroundColor: colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  edgeBlockLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: EDGE_BLOCK_WIDTH,
    backgroundColor: colors.dark,
    zIndex: 2,
  },
  edgeBlockRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: EDGE_BLOCK_WIDTH,
    backgroundColor: colors.dark,
    zIndex: 2,
  },
  arrowDisabled: {
    opacity: 0.3,
  },
  arrowLeft: {
    position: 'absolute',
    left: 6,
    top: MONTH_LABEL_HEIGHT + 8 + 20 + 4,
    zIndex: 3,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowRight: {
    position: 'absolute',
    right: 6,
    top: MONTH_LABEL_HEIGHT + 8 + 20 + 4,
    zIndex: 3,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
