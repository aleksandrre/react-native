import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { PageLayout, ScreenWrapper, CustomButton, CourtCardList } from '../components';
import { ImageHeader } from '../components/ui/ImageHeader';
import { colors, typography } from '../theme';
import { Booking } from '../types';
import { BookStackParamList } from '../navigation/MainNavigator';

type SuccessRouteProp = RouteProp<BookStackParamList, 'Success'>;

export const SuccessScreen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<BookStackParamList>>();
    const route = useRoute<SuccessRouteProp>();
    const { t } = useTranslation();

    const bookings = route.params?.bookings || [];
    const bookingId = route.params?.bookingId || '002938';
    const isSingleBooking = route.params?.isSingleBooking || false;

    const handleBookAgain = () => {
        const parentNav = navigation.getParent();
        if (parentNav) {
            (parentNav as any).navigate('Book', { screen: 'BookHome' });
        }
    };

    const handleBookingPress = (booking: Booking, index: number) => {
        navigation.push('Success', {
            bookings: [booking],
            bookingId: bookingId,
            isSingleBooking: true,
        });
    };

    const handleAddToCalendar = () => {
        console.log('Add to calendar');
    };

    const handleViewMyBookings = () => {
        const parentNav = navigation.getParent();
        if (parentNav) {
            (parentNav as any).navigate('Bookings', { screen: 'BookingsHome' });
        }
    };

    return (
        <PageLayout>
            <ImageHeader
                title={t('success.title')}
                imageSource={require('../../assets/success.png')}
            />

            <ScreenWrapper>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.contentContainer}>
                        {isSingleBooking && bookings.length === 1 ? (
                            <>
                                <Text style={styles.subtitle}>{t('success.bookingConfirmed')}</Text>
                                <View style={styles.singleBookingInfo}>
                                    <Text style={styles.singleBookingText}>{`${t('success.court')} ${bookings[0].courtNumber}`}</Text>
                                    <Text style={styles.singleBookingOn}>{t('success.at')}</Text>
                                    <Text style={styles.singleBookingText}>{`${bookings[0].time}`}</Text>
                                    <Text style={styles.singleBookingOn}>{t('success.on')}</Text>
                                    <Text style={styles.singleBookingText}>{`${bookings[0].date}`}</Text>
                                </View>
                            </>
                        ) : (
                            <>
                                <Text style={styles.subtitle}>{t('success.bookingsConfirmed')}</Text>
                                <CourtCardList
                                    title=""
                                    bookings={bookings}
                                    style={{ marginBottom: 10 }}
                                    onBookingPress={handleBookingPress}
                                />
                            </>
                        )}

                        <Text style={styles.bookingId}>{t('success.bookingId')} {`{${bookingId}}`}</Text>
                    </View>
                </ScrollView>

                <View style={styles.buttonContainer}>
                    {isSingleBooking ? (
                        <>
                            <CustomButton
                                title={t('success.addToCalendar')}
                                onPress={handleAddToCalendar}
                                variant="secondary"
                            />
                            <CustomButton
                                title={t('success.viewMyBookings')}
                                onPress={handleViewMyBookings}
                                variant="secondary"
                            />
                            <CustomButton
                                title={t('success.bookAgain')}
                                onPress={handleBookAgain}
                            />
                        </>
                    ) : (
                        <CustomButton
                            title={t('success.bookAgain')}
                            onPress={handleBookAgain}
                        />
                    )}
                </View>
            </ScreenWrapper>

        </PageLayout>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 80,
        minHeight: '100%',
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
        display: 'flex',
        gap: 10,
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
        marginBottom: 12,
    },
    bookingId: {
        fontSize: 18,
        fontFamily: typography.fontFamilyBold,
        color: colors.white,
        textAlign: 'left',
    },
    singleBookingInfo: {
        alignItems: 'center',
        marginBottom: 10,
    },
    singleBookingText: {
        fontSize: 20,
        lineHeight: 24,
        fontFamily: typography.fontFamilyBold,
        color: colors.white,
        textAlign: 'center',
        marginBottom: 12,
    },
    singleBookingOn: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: typography.fontFamily,
        color: colors.lightGray,
        textAlign: 'center',
        marginBottom: 12,
    },
});
