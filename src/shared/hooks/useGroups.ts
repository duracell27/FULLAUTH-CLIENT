import { useInfiniteQuery } from "@tanstack/react-query";
import { groupsService } from "../services";
import { IUserGroup } from '../types/groupe.types';

interface GroupsResponse {
    groups: IUserGroup[];
    activeCount: number;
    finishedCount: number;
}

export function useGroups() {
    // Active groups
    const {
        data: activeData,
        fetchNextPage: loadMoreActive,
        hasNextPage: hasNextActive,
        isLoading: isLoadingActive,
        isFetchingNextPage: isFetchingNextActive,
    } = useInfiniteQuery<GroupsResponse, Error>({
        queryKey: ['groups', 'active'],
        queryFn: async ({ pageParam = 0 }) => {
            const offset = typeof pageParam === 'number' ? pageParam : Number(pageParam) || 0;
            const res = await groupsService.getGroups({ type: 'active', limit: 10, offset });
            return res || { groups: [], activeCount: 0, finishedCount: 0 };
        },
        getNextPageParam: (lastPage: GroupsResponse, allPages: GroupsResponse[]) =>
            lastPage.groups.length === 10 ? allPages.length * 10 : undefined,
        initialPageParam: 0,
    });

    // Finished groups
    const {
        data: finishedData,
        fetchNextPage: loadMoreFinished,
        hasNextPage: hasNextFinished,
        isLoading: isLoadingFinished,
        isFetchingNextPage: isFetchingNextFinished,
    } = useInfiniteQuery<GroupsResponse, Error>({
        queryKey: ['groups', 'finished'],
        queryFn: async ({ pageParam = 0 }) => {
            const offset = typeof pageParam === 'number' ? pageParam : Number(pageParam) || 0;
            const res = await groupsService.getGroups({ type: 'finished', limit: 10, offset });
            return res || { groups: [], activeCount: 0, finishedCount: 0 };
        },
        getNextPageParam: (lastPage: GroupsResponse, allPages: GroupsResponse[]) =>
            lastPage.groups.length === 10 ? allPages.length * 10 : undefined,
        initialPageParam: 0,
    });

    // Збираємо всі групи в один масив для кожного типу
    const activeGroups = activeData?.pages ? activeData.pages.flatMap(page => page.groups) : [];
    const finishedGroups = finishedData?.pages ? finishedData.pages.flatMap(page => page.groups) : [];

    // Отримуємо counts з першої сторінки (вони однакові для всіх сторінок)
    const activeCount = activeData?.pages?.[0]?.activeCount || 0;
    const finishedCount = finishedData?.pages?.[0]?.finishedCount || 0;

    return {
        activeGroups,
        finishedGroups,
        activeCount,
        finishedCount,
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