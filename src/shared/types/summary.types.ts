import { IGroup } from "./groupe.types";
import { IUser } from "./user.types";

export interface ISummary {
    user: IUser,
    totalBalance: number,
    groups: {
        groupInfo: IGroup,
        balance: number
    }[]
}

export interface ISummaryResponse {
    userBalances: ISummary[]
    totalBalance: number
}