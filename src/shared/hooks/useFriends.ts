import { useQuery } from "@tanstack/react-query";
import { friendsService } from "../services/friends.service";

export function useFriends() {
    const {data:friendsData, isLoading: isLoadingFriend} = useQuery({
        queryKey: ['friends'],
        queryFn: () => friendsService.getFriends(),
        staleTime: 0,
    })

    return {friendsData, isLoadingFriend}
}