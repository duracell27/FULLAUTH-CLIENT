import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { userService } from "../services";

export function useProfile() {
    const {data:user, isLoading: isLoadingProfile} = useQuery({
        queryKey: ['profile'],
        queryFn: () => userService.findProfile(),
    })

    // Очищаємо logout-flag якщо користувач успішно залогінений
    // Це потрібно для OAuth та інших методів входу
    useEffect(() => {
        if (user && typeof localStorage !== 'undefined') {
            localStorage.removeItem('logout-flag')
        }
    }, [user])

    return {user, isLoadingProfile}
}