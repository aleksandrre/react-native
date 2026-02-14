import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PageLayout, ScreenWrapper, CustomButton, CourtCardList } from '../components';
import { ImageHeader } from '../components/ui/ImageHeader';
import { colors, typography } from '../theme';
import { Booking } from '../types';
import { BookStackParamList } from '../navigation/MainNavigator';

type SuccessRouteProp = RouteProp<BookStackParamList, 'Success'>;

export const SuccessScreen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<BookStackParamList>>();
    const route = useRoute<SuccessRouteProp>();

    const bookings = route.params?.bookings || [];
    const bookingId = route.params?.bookingId || '002938';
    const isSingleBooking = route.params?.isSingleBooking || false;

    const handleBookAgain = () => {
        // Navigate back to the beginning of booking flow
        navigation.navigate('BookHome');
    };

    const handleBookingPress = (booking: Booking, index: number) => {
        // Navigate to single booking view
        navigation.push('Success', {
            bookings: [booking],
            bookingId: bookingId,
            isSingleBooking: true,
        });
    };

    const handleAddToCalendar = () => {
        console.log('Add to calendar');
        // TODO: Add to calendar functionality
    };

    const handleViewMyBookings = () => {
        console.log('View my bookings');
        // TODO: Navigate to bookings screen
    };

    return (
        <PageLayout>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Success Header */}
                <ImageHeader
                    title="Success!"
                    imageSource={require('../../assets/success.png')}
                />

                <View style={styles.contentPadding}>
                    {/* Success Message */}
                    <View style={styles.contentContainer}>
                        {isSingleBooking && bookings.length === 1 ? (
                            // Single booking view
                            <>
                                <Text style={styles.subtitle}>Your booking is confirmed:</Text>
                                <View style={styles.singleBookingInfo}>
                                    <Text style={styles.singleBookingText}>{`Court ${bookings[0].courtNumber}`}</Text>
                                    <Text style={styles.singleBookingOn}>at</Text>
                                    <Text style={styles.singleBookingText}>{`${bookings[0].time}`}</Text>
                                    <Text style={styles.singleBookingOn}>on</Text>
                                    <Text style={styles.singleBookingText}>{`${bookings[0].date}`}</Text>
                                </View>
                            </>
                        ) : (
                            // Multiple bookings view
                            <>
                                <Text style={styles.subtitle}>Your bookings are confirmed:</Text>
                                <CourtCardList
                                    title=""
                                    bookings={bookings}
                                    style={{ marginBottom: 10 }}
                                    onBookingPress={handleBookingPress}
                                />
                            </>
                        )}

                        {/* Booking ID */}
                        <Text style={styles.bookingId}>Booking ID: {`{${bookingId}}`}</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Fixed Book Again Button */}
            <View style={styles.buttonContainer}>
                {isSingleBooking ? (
                    // Single booking buttons
                    <>
                        <CustomButton
                            title="Add to calendar"
                            onPress={handleAddToCalendar}
                            variant="secondary"
                        />
                        <CustomButton
                            title="View my bookings"
                            onPress={handleViewMyBookings}
                            variant="secondary"
                        />
                        <CustomButton
                            title="Book again"
                            onPress={handleBookAgain}
                        />
                    </>
                ) : (
                    // Multiple bookings button
                    <CustomButton
                        title="Book again"
                        onPress={handleBookAgain}
                    />
                )}
            </View>
        </PageLayout>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 80,
        minHeight: '100%',
    },
    contentPadding: {
        padding: 10,
        backgroundColor: colors.dark,
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 20,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 10,
        backgroundColor: colors.dark,
    },
    title: {
        fontSize: 32,
        lineHeight: 40,
        fontFamily: typography.fontFamilyBold,
        color: colors.white,
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 20,
        fontFamily: typography.fontFamily,
        color: colors.white,
        textAlign: 'center',
        marginBottom: 20,
    },
    bookingId: {
        fontSize: 14,
        lineHeight: 18,
        fontFamily: typography.fontFamilySemiBold,
        color: colors.white,
        textAlign: 'left',
        marginBottom: 24,
    },
    singleBookingInfo: {
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    singleBookingText: {
        fontSize: 18,
        lineHeight: 24,
        fontFamily: typography.fontFamilySemiBold,
        color: colors.white,
        textAlign: 'center',
    },
    singleBookingOn: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: typography.fontFamily,
        color: colors.lightGray,
        textAlign: 'center',
        marginVertical: 4,
    },
});
