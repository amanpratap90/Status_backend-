import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { habitService } from '../services/habitService';
import { Habit } from '../types';
import { format } from 'date-fns';

export const useHabits = () => {
    const queryClient = useQueryClient();
    const today = format(new Date(), 'yyyy-MM-dd');

    const habitsQuery = useQuery({
        queryKey: ['habits'],
        queryFn: habitService.getHabits,
        staleTime: 1000 * 60 * 5, // 5 minutes (data remains fresh)
        gcTime: 1000 * 60 * 60 * 24, // 24 hours (cache persistence)
    });

    const toggleHabitMutation = useMutation({
        mutationFn: async ({ id, date }: { id: string, date: string }) => {
            // We assume the backend toggle endpoint handles the logic
            // But habitService.updateHabitStatus signature might need adjustment or we use a simpler toggle call
            // Let's assume habitService.updateHabitStatus is what we want, but check its signature
            // It expects (habitId, date, completed). We need to know current state to toggle.
            // For now, let's just trigger the API call. The optimistic update will handle the UI.

            // To properly call the service as currently defined:
            // We'd need to know if we are completing or uncompleting.
            // But let's look at `habitService.ts` again.
            // updateHabitStatus(habitId, date, completed).

            // We can simplify and just call a toggle endpoint if it existed, but utilizing existing service:
            // We'll rely on the previous state from cache to determine 'completed' status.

            const previousHabits = queryClient.getQueryData<Habit[]>(['habits']);
            const habit = previousHabits?.find(h => h.id === id);
            const isCompleted = habit?.completedDays.includes(date);

            return habitService.updateHabitStatus(id, date, !isCompleted);
        },
        onMutate: async ({ id, date }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['habits'] });

            // Snapshot previous value
            const previousHabits = queryClient.getQueryData<Habit[]>(['habits']);

            // Optimistically update
            if (previousHabits) {
                queryClient.setQueryData<Habit[]>(['habits'], (old) => {
                    if (!old) return [];
                    return old.map(h => {
                        if (h.id === id) {
                            const isCompleted = h.completedDays.includes(date);
                            const newCompletedDays = isCompleted
                                ? h.completedDays.filter(d => d !== date)
                                : [...h.completedDays, date];

                            // Simple streak calc for optimistic UI (Can be improved)
                            const newStreak = isCompleted ? Math.max(0, h.streak - 1) : h.streak + 1;

                            return {
                                ...h,
                                completedDays: newCompletedDays,
                                streak: newStreak
                            };
                        }
                        return h;
                    });
                });
            }

            return { previousHabits };
        },
        onError: (err, variables, context) => {
            if (context?.previousHabits) {
                queryClient.setQueryData(['habits'], context.previousHabits);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] });
        },
    });

    const createHabitMutation = useMutation({
        mutationFn: habitService.createHabit,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] });
        },
    });

    return {
        habits: habitsQuery.data || [],
        isLoading: habitsQuery.isLoading && !habitsQuery.data, // Only loading if no cached data
        isRefetching: habitsQuery.isRefetching,
        refetch: habitsQuery.refetch,
        toggleHabit: toggleHabitMutation.mutate,
        createHabit: createHabitMutation.mutateAsync,
        isCreating: createHabitMutation.isPending
    };
};
