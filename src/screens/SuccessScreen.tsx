import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { PageLayout, ScreenWrapper, CustomButton, CourtCardList } from '../components';
import { colors, typography } from '../theme';
import { Booking } from '../types';
import { BookStackParamList } from '../navigation/MainNavigator';

type SuccessRouteProp = RouteProp<BookStackParamList, 'Success'>;

export const SuccessScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp<BookStackParamList>>();
    const route = useRoute<SuccessRouteProp>();

    const bookings = route.params?.bookings || [];
    const bookingId = route.params?.bookingId || '002938';

    const handleBookAgain = () => {
        // Navigate back to the beginning of booking flow
        navigation.navigate('BookHome');
    };

    return (
        <PageLayout>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Success Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={require('../../assets/success.png')}
                        style={styles.image}
                        resizeMode="cover"
                    />
                </View>

                <View style={styles.contentPadding}>
                    {/* Success Message */}
                    <View style={styles.contentContainer}>
                        <Text style={styles.subtitle}>Your bookings are confirmed:</Text>

                        {/* Bookings List */}
                        <CourtCardList title="" bookings={bookings} style={{ marginBottom: 10 }} />

                        {/* Booking ID */}
                        <Text style={styles.bookingId}>Booking ID: {`{${bookingId}}`}</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Fixed Book Again Button */}
            <View style={styles.buttonContainer}>
                <CustomButton
                    title="Book again"
                    onPress={handleBookAgain}
                />
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
    imageContainer: {
        width: '100%',
        height: 200,
    },
    image: {
        width: '100%',
        height: '100%',
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
});
