import { useRef, useState } from 'react';
import {
  Animated,
  Easing,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import {
  useFonts,
  Onest_400Regular,
  Onest_600SemiBold,
  Onest_700Bold,
  Onest_800ExtraBold,
} from '@expo-google-fonts/onest';
import { useActivities } from './src/useActivities';
import { Activity } from './src/types';
import { colors, radius, spacing, type } from './src/theme';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDuration(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const hourPart = { amount: hours, short: 'h', long: hours === 1 ? 'hour' : 'hours' };
  const minutePart = { amount: minutes, short: 'm', long: minutes === 1 ? 'minute' : 'minutes' };
  if (hours === 0) {
    return [minutePart];
  }
  if (minutes === 0) {
    return [hourPart];
  }
  return [hourPart, minutePart];
}

function durationText(totalMinutes: number) {
  return formatDuration(totalMinutes)
    .map((part) => part.amount + part.short)
    .join(' ');
}

function dayLabel(date: Date) {
  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getDay()] + ' ' + date.getDate() + ' ' + MONTHS[date.getMonth()];
}

function shortDate(date: Date) {
  return date.getDate() + ' ' + MONTHS[date.getMonth()];
}

function timeLabel(date: Date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const suffix = hours < 12 ? 'am' : 'pm';
  const hour = hours % 12 === 0 ? 12 : hours % 12;
  return hour + ':' + String(minutes).padStart(2, '0') + ' ' + suffix;
}

function ActivityRow({ activity }: { activity: Activity }) {
  const loggedAt = new Date(activity.loggedAt);
  return (
    <View style={styles.row}>
      <View style={styles.rowMain}>
        <Text style={styles.rowName}>{activity.name}</Text>
        <Text style={styles.rowMeta}>
          {timeLabel(loggedAt)}
          {activity.notes ? ' · ' + activity.notes : ''}
        </Text>
      </View>
      <Text style={styles.rowValue}>
        {formatDuration(activity.durationMinutes).map((part, index) => (
          <Text key={part.short}>
            {index > 0 ? ' ' : ''}
            {part.amount}
            <Text style={styles.rowValueUnit}>{part.short}</Text>
          </Text>
        ))}
      </Text>
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Onest_400Regular,
    Onest_600SemiBold,
    Onest_700Bold,
    Onest_800ExtraBold,
  });
  const { activities, loading, addActivity } = useActivities();
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetProgress = useRef(new Animated.Value(0)).current;
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');

  const logged = activities.filter((a) => a.durationMinutes);
  const totalMinutes = logged.reduce((sum, a) => sum + a.durationMinutes, 0);

  let earliestLoggedAt = '';
  for (const activity of activities) {
    if (!earliestLoggedAt || activity.loggedAt < earliestLoggedAt) {
      earliestLoggedAt = activity.loggedAt;
    }
  }

  const sections: { label: string; items: Activity[] }[] = [];
  for (const activity of activities) {
    const label = dayLabel(new Date(activity.loggedAt));
    const current = sections[sections.length - 1];
    if (current && current.label === label) {
      current.items.push(activity);
    } else {
      sections.push({ label: label, items: [activity] });
    }
  }

  const listData: ({ kind: 'header'; label: string; total: number } | { kind: 'row'; activity: Activity })[] = [];
  for (const section of sections) {
    let sectionTotal = 0;
    for (const item of section.items) {
      sectionTotal += item.durationMinutes;
    }
    listData.push({ kind: 'header', label: section.label, total: sectionTotal });
    for (const item of section.items) {
      listData.push({ kind: 'row', activity: item });
    }
  }

  function openSheet() {
    setSheetOpen(true);
    Animated.timing(sheetProgress, {
      toValue: 1,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }

  function closeSheet() {
    Animated.timing(sheetProgress, {
      toValue: 0,
      duration: 200,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: Platform.OS !== 'web',
    }).start(() => setSheetOpen(false));
  }

  async function onSave() {
    if (!name || !duration) {
      console.warn('Name and duration are required');
      return;
    }
    await addActivity(name, duration, notes);
    setName('');
    setDuration('');
    setNotes('');
    closeSheet();
  }

  if (!fontsLoaded || loading) {
    return <View style={styles.screen} />;
  }

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.statusBand} />

      <View style={styles.header}>
        <Image source={require('./assets/fp-logo.png')} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.summary}>
        {activities.length === 0 ? (
          <>
            <Text style={styles.kicker}>Nothing logged yet</Text>
            <Text style={styles.emptyLead}>
              Log your first activity and it will show up here.
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.kicker}>You&rsquo;ve been active for</Text>
        <Text style={styles.display}>
          {formatDuration(totalMinutes).map((part, index, parts) => (
            <Text key={part.short}>
              {index > 0 ? <Text style={styles.displayUnit}> </Text> : null}
              {part.amount}
              <Text style={styles.displayUnit}>
                {' ' + part.long}
                {index === 0 && parts.length > 1 ? ',' : ''}
              </Text>
            </Text>
          ))}
        </Text>
            <Text style={styles.sessions}>
              across {logged.length} {logged.length === 1 ? 'session' : 'sessions'}
              {earliestLoggedAt ? ' since ' + shortDate(new Date(earliestLoggedAt)) : ''}
            </Text>
          </>
        )}
      </View>

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={listData}
        keyExtractor={(item, index) => String(index)}
        renderItem={({ item }) =>
          item.kind === 'header' ? (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>{item.label.toUpperCase()}</Text>
              <Text style={styles.sectionTotal}>{durationText(item.total)}</Text>
            </View>
          ) : (
            <ActivityRow activity={item.activity} />
          )
        }
      />

      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}
          onPress={openSheet}
        >
          <Text style={styles.actionText}>Log an activity</Text>
          <View style={styles.actionIcon}>
            <View style={styles.actionIconBar} />
            <View style={[styles.actionIconBar, styles.actionIconBarVertical]} />
          </View>
        </Pressable>
      </View>

      <Modal visible={sheetOpen} transparent animationType="none" onRequestClose={closeSheet}>
        <View style={styles.modalRoot}>
          <Animated.View style={[styles.scrim, { opacity: sheetProgress }]}>
            <Pressable style={styles.scrimPress} onPress={closeSheet} />
          </Animated.View>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Animated.View
            style={[
              styles.sheet,
              {
                transform: [
                  {
                    translateY: sheetProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [460, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.grabber} />
            <Text style={styles.sheetTitle}>Log an activity</Text>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Activity name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Morning run"
                placeholderTextColor={colors.inkFaint}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Duration</Text>
              <View style={styles.inputWithSuffix}>
                <TextInput
                  style={styles.inputFlex}
                  value={duration}
                  onChangeText={setDuration}
                  placeholder="30"
                  placeholderTextColor={colors.inkFaint}
                  keyboardType="numeric"
                />
                <Text style={styles.suffix}>minutes</Text>
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>
                Notes <Text style={styles.optional}>(optional)</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={notes}
                onChangeText={setNotes}
                placeholder="Anything worth remembering"
                placeholderTextColor={colors.inkFaint}
              />
            </View>

            <Pressable
              style={({ pressed }) => [styles.action, styles.save, pressed && styles.actionPressed]}
              onPress={onSave}
            >
                <Text style={styles.actionText}>Save activity</Text>
              </Pressable>
            </Animated.View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  statusBand: {
    height: Constants.statusBarHeight,
    backgroundColor: colors.ink,
  },
  header: {
    paddingBottom: spacing.xl,
  },
  logo: {
    width: 113,
    height: 80,
  },
  summary: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  kicker: {
    ...type.lead,
    color: colors.inkMuted,
  },
  display: {
    ...type.display,
    color: colors.ink,
  },
  displayUnit: {
    ...type.lead,
    color: colors.inkMuted,
  },
  sessions: {
    ...type.lead,
    color: colors.inkMuted,
    marginTop: spacing.xs,
  },
  emptyLead: {
    ...type.lead,
    color: colors.inkMuted,
    marginTop: spacing.sm,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 120,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 22,
    paddingBottom: 4,
  },
  sectionLabel: {
    ...type.sectionLabel,
    color: colors.ink,
  },
  sectionTotal: {
    ...type.meta,
    color: colors.inkMuted,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingVertical: 15,
  },
  rowMain: {
    flex: 1,
  },
  rowName: {
    ...type.body,
    color: colors.ink,
  },
  rowMeta: {
    fontFamily: 'Onest_400Regular',
    fontSize: 13.5,
    color: '#667085',
    marginTop: 3,
  },
  rowValue: {
    ...type.value,
    color: colors.ink,
  },
  rowValueUnit: {
    fontFamily: 'Onest_600SemiBold',
    fontSize: 12.5,
    color: colors.inkMuted,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: 34,
  },
  action: {
    height: 54,
    borderRadius: radius.control,
    backgroundColor: colors.action,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  actionIcon: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    borderWidth: 1,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconBar: {
    position: 'absolute',
    width: 11,
    height: 1.5,
    borderRadius: 1,
    backgroundColor: colors.surface,
  },
  actionIconBarVertical: {
    width: 1.5,
    height: 11,
  },
  actionPressed: {
    backgroundColor: colors.actionPressed,
  },
  actionText: {
    ...type.button,
    color: colors.surface,
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.scrim,
  },
  scrimPress: {
    flex: 1,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: 34,
  },
  grabber: {
    width: 38,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#d7e1ef',
    alignSelf: 'center',
    marginBottom: 18,
  },
  sheetTitle: {
    ...type.title,
    color: colors.ink,
    marginBottom: 20,
  },
  field: {
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    ...type.label,
    color: colors.inkMuted,
    marginBottom: 7,
  },
  optional: {
    fontFamily: 'Onest_400Regular',
    color: colors.inkFaint,
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radius.control,
    paddingHorizontal: 15,
    ...type.bodyRegular,
    color: colors.ink,
  },
  inputWithSuffix: {
    height: 52,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radius.control,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputFlex: {
    flex: 1,
    ...type.bodyRegular,
    color: colors.ink,
  },
  suffix: {
    fontFamily: 'Onest_600SemiBold',
    fontSize: 14,
    color: '#667085',
  },
  save: {
    marginTop: spacing.sm,
  },
});
