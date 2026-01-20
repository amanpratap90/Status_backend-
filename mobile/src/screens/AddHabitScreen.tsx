import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { habitService } from '../services/habitService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../styles/theme';

export default function AddHabitScreen() {
    const navigation = useNavigation<any>();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('General');
    const [color, setColor] = useState('#22c55e');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const colors = ['#22c55e', '#f97316', '#ef4444', '#3b82f6', '#a855f7', '#ec4899'];

    const handleCreate = async () => {
        if (!name) {
            Alert.alert('Error', 'Please enter a habit name');
            return;
        }

        setIsSubmitting(true);
        try {
            await habitService.createHabit({
                name,
                description,
                category,
                color
            });
            Alert.alert('Success', 'Habit created successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error('Create habit error:', error);
            Alert.alert('Error', 'Failed to create habit');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>New Habit</Text>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Goal Name</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="e.g. Master React Native"
                        placeholderTextColor={theme.colors.textSecondary}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Define your why..."
                        placeholderTextColor={theme.colors.textSecondary}
                        multiline
                        textAlignVertical="top"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Color</Text>
                    <View style={styles.colorContainer}>
                        {colors.map(c => (
                            <TouchableOpacity
                                key={c}
                                style={[
                                    styles.colorButton,
                                    { backgroundColor: c },
                                    color === c && styles.colorSelected
                                ]}
                                onPress={() => setColor(c)}
                            />
                        ))}
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.button, isSubmitting && styles.buttonDisabled]}
                    onPress={handleCreate}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <Text style={styles.buttonText}>Launch Flow</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        padding: theme.spacing.l,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    cancelText: {
        color: theme.colors.textSecondary,
        fontSize: 16,
    },
    formGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.s,
        textTransform: 'uppercase',
    },
    input: {
        backgroundColor: theme.colors.inputBackground,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        fontSize: 16,
        color: theme.colors.text,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    textArea: {
        minHeight: 100,
    },
    colorContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    colorButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    colorSelected: {
        borderWidth: 3,
        borderColor: theme.colors.text,
    },
    button: {
        backgroundColor: theme.colors.primary,
        padding: 18,
        borderRadius: theme.borderRadius.m,
        alignItems: 'center',
        marginTop: 24,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: '900',
    }
});
