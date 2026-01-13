import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { userService } from "../services";
import { cookieUtils } from "../utils/cookie";

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

    // Синхронізуємо мову користувача з cookie
    useEffect(() => {
        if (user?.language) {
            const currentCookieLanguage = cookieUtils.getLanguage()
            // Якщо мова в профілі відрізняється від мови в cookie, оновлюємо cookie
            if (currentCookieLanguage !== user.language) {
                console.log('[useProfile] Syncing user language to cookie:', user.language)
                cookieUtils.setLanguage(user.language)
            }
        }
    }, [user?.language])

    return {user, isLoadingProfile}
}