import { useQuery } from "@tanstack/react-query";
import { userService } from "../services";

export function useProfile() {
    const {data:user, isLoading: isLoadingProfile} = useQuery({
        queryKey: ['profile'],
        queryFn: () => userService.findProfile(),
    })

    return {user, isLoadingProfile}
}