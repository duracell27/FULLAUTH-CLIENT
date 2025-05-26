import { useQuery } from "@tanstack/react-query";
import { friendsService } from "../services/friends.service";
import { groupsService } from "../services";

export function useGroups() {
    const {data:userGroups, isLoading: isLoadingUserGroups} = useQuery({
        queryKey: ['groups'],
        queryFn: () => groupsService.getGroups(),
    })

    return {userGroups, isLoadingUserGroups}
}