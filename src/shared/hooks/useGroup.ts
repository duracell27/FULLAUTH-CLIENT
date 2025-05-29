import { useQuery } from "@tanstack/react-query";
import { friendsService } from "../services/friends.service";
import { groupsService } from "../services";

export function useGroup(groupId: string) {
    const {data:group, isLoading: isLoadingGroup} = useQuery({
        queryKey: ['group ' + groupId],
        queryFn: () => groupsService.getGroup(groupId),
    })

    return {group, isLoadingGroup}
}