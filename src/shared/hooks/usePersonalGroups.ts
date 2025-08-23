import { useInfiniteQuery } from "@tanstack/react-query";
import { groupsService } from "../services";
import { IUserGroup } from '../types/groupe.types';

export function usePersonalGroups() {
    // Active groups
    const {
        data: activeData,
        fetchNextPage: loadMoreActive,
        hasNextPage: hasNextActive,
        isLoading: isLoadingActive,
        isFetchingNextPage: isFetchingNextActive,
    } = useInfiniteQuery<IUserGroup[], Error>({
        queryKey: ['groups', 'activePersonal'],
        queryFn: async ({ pageParam = 0 }) => {
            const offset = typeof pageParam === 'number' ? pageParam : Number(pageParam) || 0;
            const res = await groupsService.getPersonalGroups({ type: 'active', limit: 10, offset });
            return res || [];
        },
        getNextPageParam: (lastPage: IUserGroup[], allPages: IUserGroup[][]) =>
            lastPage.length === 10 ? allPages.length * 10 : undefined,
        initialPageParam: 0,
    });

    // Finished groups
    const {
        data: finishedData,
        fetchNextPage: loadMoreFinished,
        hasNextPage: hasNextFinished,
        isLoading: isLoadingFinished,
        isFetchingNextPage: isFetchingNextFinished,
    } = useInfiniteQuery<IUserGroup[], Error>({
        queryKey: ['groups', 'finishedPersonal'],
        queryFn: async ({ pageParam = 0 }) => {
            const offset = typeof pageParam === 'number' ? pageParam : Number(pageParam) || 0;
            const res = await groupsService.getPersonalGroups({ type: 'finished', limit: 10, offset });
            return res || [];
        },
        getNextPageParam: (lastPage: IUserGroup[], allPages: IUserGroup[][]) =>
            lastPage.length === 10 ? allPages.length * 10 : undefined,
        initialPageParam: 0,
    });

    // Збираємо всі групи в один масив для кожного типу
    const activeGroups = activeData?.pages ? activeData.pages.flat() : [];
    const finishedGroups = finishedData?.pages ? finishedData.pages.flat() : [];

    return {
        activeGroups,
        finishedGroups,
        loadMoreActive,
        loadMoreFinished,
        hasNextActive,
        hasNextFinished,
        isLoadingActive,
        isLoadingFinished,
        isFetchingNextActive,
        isFetchingNextFinished,
    };
}