import { TypeLoginSchema, TypeNewPasswordSchema, TypeRegisterSchema } from '../schemas'
import { TypePasswordResetSchema } from '../schemas/passwordReset.schema'
import { IUser } from '../types'
import { api } from '../utils/api'

class PasswordRecoveryService {
    public async reset(body: TypePasswordResetSchema, recaptcha?: string) {
        const headers = recaptcha ? { recaptcha } : undefined

        const response = await api.post<IUser>('auth/password-recovery/reset', body, {
            headers
        })

        return response
    }

     public async new(body: TypeNewPasswordSchema, token: string|null, recaptcha?: string) {
        const headers = recaptcha ? { recaptcha } : undefined

        const response = await api.post<IUser>(`auth/password-recovery/new/${token}`, body, {
            headers
        })

        return response
    }
}

export const passwordRecoveryService = new PasswordRecoveryService()
