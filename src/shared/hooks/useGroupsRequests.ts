import { useQuery } from "@tanstack/react-query";
import { memberService } from "../services/members.service";

export function useGroupsRequests() {
    const {data:userGroupsRequests, isLoading: isLoadingUserGroupsRequests} = useQuery({
        queryKey: ['groups requests'],
        queryFn: () => memberService.getGroupsRequests(),
    })

    return {userGroupsRequests, isLoadingUserGroupsRequests}
}