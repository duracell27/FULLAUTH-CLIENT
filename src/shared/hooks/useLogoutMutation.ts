'use client'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services";
import { toastMessageHandler } from "../utils";
import { toast } from "sonner";
import { useTranslations } from "./useTranslations";

// Функція для очищення всіх cookies (для Safari)
const clearAllCookies = () => {
    if (typeof document === 'undefined') return

    // Отримуємо всі cookies
    const cookies = document.cookie.split(';')

    // Видаляємо кожен cookie з різними варіантами domain і path
    cookies.forEach(cookie => {
        const cookieName = cookie.split('=')[0].trim()

        // Варіанти видалення для Safari
        const domains = [
            window.location.hostname,
            `.${window.location.hostname}`,
            ''
        ]

        const paths = ['/', '']

        domains.forEach(domain => {
            paths.forEach(path => {
                // Видаляємо cookie
                document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}${domain ? `; domain=${domain}` : ''}; SameSite=Lax`
                document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}${domain ? `; domain=${domain}` : ''}; SameSite=Strict`
                document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}${domain ? `; domain=${domain}` : ''}; SameSite=None; Secure`
            })
        })
    })
}

export function useLogoutMutation() {
    const { t } = useTranslations()

    const queryClient = useQueryClient()

    const {mutate: logout, isPending: isLoadingLogout} = useMutation({
        mutationKey: ['logout'],
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            toast.success(t('youHaveBeenLoggedOutSuccessfully'))
            queryClient.clear()

            // Очищаємо всі cookies (особливо важливо для Safari)
            clearAllCookies()

            // Встановлюємо прапорець що користувач вийшов (для Safari)
            // Це допоможе уникнути автоматичного входу з застарілим session cookie
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('logout-flag', Date.now().toString())
            }

            // Даємо backend час видалити session cookie (важливо для Safari)
            // Safari може не встигнути обробити видалення cookie від backend
            setTimeout(() => {
                // Використовуємо window.location для жорсткого редиректу
                // Це гарантує повне очищення стану і перезавантаження сторінки
                window.location.href = '/'
            }, 100)
        },
        onError: (error) => {
            toastMessageHandler(error)
        }
    })

    return {logout, isLoadingLogout}
}