import { useQuery } from "@tanstack/react-query";
import { groupsService } from "../services";

export function useGroups() {
    const {data:userGroups, isLoading: isLoadingUserGroups} = useQuery({
        queryKey: ['groups'],
        queryFn: () => groupsService.getGroups(),
    })

    return {userGroups, isLoadingUserGroups}
}