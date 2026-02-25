import { useQuery } from "@tanstack/react-query";
import { friendsService } from "../services/friends.service";
import { groupsService } from "../services";

export function useGroup(groupId: string) {
    const {data:group, isLoading: isLoadingGroup, isError: isErrorGroup, refetch: refetchGroup} = useQuery({
        queryKey: ['group ' + groupId],
        queryFn: () => groupsService.getGroup(groupId),
        staleTime: 0,
    })

    return {group, isLoadingGroup, isErrorGroup, refetchGroup}
}