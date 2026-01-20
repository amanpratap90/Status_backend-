import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useHabits } from '../hooks/useHabits';
import { Habit } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../styles/theme';

export default function DashboardScreen() {
    const { user, logout } = useAuth();
    const navigation = useNavigation();
    const { habits, isLoading, isRefetching, refetch, toggleHabit } = useHabits();
    const today = format(new Date(), 'yyyy-MM-dd');

    const onRefresh = () => {
        refetch();
    };

    const handleToggleHabit = (habitId: string) => {
        toggleHabit({ id: habitId, date: today });
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <View>
                <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'User'}</Text>
                <Text style={styles.date}>{format(new Date(), 'EEEE, d MMMM')}</Text>
            </View>
            <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );

    const renderHabitItem = ({ item }: { item: Habit }) => (
        <TouchableOpacity style={[styles.habitCard, { borderLeftColor: item.color }]} onPress={() => handleToggleHabit(item.id)}>
            <View style={styles.habitInfo}>
                <Text style={styles.habitName}>{item.name}</Text>
                <Text style={styles.habitStreak}>🔥 {item.streak} days</Text>
            </View>
            <View style={[styles.checkbox, item.completedDays.includes(format(new Date(), 'yyyy-MM-dd')) && styles.checkedCheckbox]}>
                {/* Add Check Icon if needed */}
            </View>
        </TouchableOpacity>
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={habits}
                renderItem={renderHabitItem}
                keyExtractor={item => item.id}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} tintColor={theme.colors.text} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No habits found. Start by creating one!</Text>
                    </View>
                }
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddHabit' as never)}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    listContent: {
        padding: theme.spacing.m,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.l,
    },
    greeting: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    date: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        marginTop: 4,
    },
    logoutButton: {
        padding: theme.spacing.s,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderRadius: theme.borderRadius.s,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.2)',
    },
    logoutText: {
        color: theme.colors.error,
        fontWeight: '600',
        fontSize: 12,
    },
    habitCard: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.borderRadius.m,
        padding: theme.spacing.m,
        marginBottom: theme.spacing.m,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderLeftWidth: 4,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    habitInfo: {
        flex: 1,
    },
    habitName: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 4,
    },
    habitStreak: {
        fontSize: 14,
        color: '#f97316', // Orange
        fontWeight: '500',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: theme.colors.textSecondary,
    },
    checkedCheckbox: {
        backgroundColor: theme.colors.success,
        borderColor: theme.colors.success,
    },
    emptyContainer: {
        padding: theme.spacing.xl,
        alignItems: 'center',
    },
    emptyText: {
        color: theme.colors.textSecondary,
        fontSize: 16,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: theme.colors.primary,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },
    fabText: {
        fontSize: 32,
        color: '#000',
        marginTop: -4,
        fontWeight: 'bold',
    },
});
