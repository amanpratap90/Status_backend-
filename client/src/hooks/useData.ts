import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getHabits, saveHabit, deleteHabit, toggleHabitCompletion, toggleSubtask, getNotes, saveNote, deleteNote } from '../services/api';
import { Habit, Note } from '../types';

export const useHabits = () => {
    return useQuery({
        queryKey: ['habits'],
        queryFn: getHabits,
        staleTime: 10 * 60 * 1000, // 10 minutes (increased from 5)
        gcTime: 30 * 60 * 1000, // 30 minutes
        refetchOnWindowFocus: false, // Disable to improve performance
    });
};

export const useCreateHabit = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: saveHabit,
        onSuccess: (newHabits) => {
            queryClient.setQueryData(['habits'], newHabits);
        },
    });
};

export const useDeleteHabit = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteHabit,
        onSuccess: (newHabits) => {
            queryClient.setQueryData(['habits'], newHabits);
        },
    });
};

export const useToggleHabit = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, date }: { id: string; date: string }) => toggleHabitCompletion(id, date),
        onSuccess: (newHabits) => {
            queryClient.setQueryData(['habits'], newHabits);
        },
    });
};

export const useToggleSubtask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ habitId, subtaskId }: { habitId: string; subtaskId: string }) => toggleSubtask(habitId, subtaskId),
        onSuccess: (newHabits) => {
            queryClient.setQueryData(['habits'], newHabits);
        },
    });
};

export const useNotes = () => {
    return useQuery({
        queryKey: ['notes'],
        queryFn: getNotes,
        staleTime: 5 * 60 * 1000,
    });
};

export const useCreateNote = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: saveNote,
        onSuccess: (newNotes) => {
            queryClient.setQueryData(['notes'], newNotes);
        },
    });
};

export const useDeleteNote = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteNote,
        onSuccess: (newNotes) => {
            queryClient.setQueryData(['notes'], newNotes);
        },
    });
};
