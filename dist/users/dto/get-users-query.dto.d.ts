export declare const USERS_ORDERABLE_COLUMNS: readonly ["profile.firstname", "profile.lastname", "profile.phone", "user.email", "id_admin_type", "disabled_at"];
export type UsersOrderableColumn = (typeof USERS_ORDERABLE_COLUMNS)[number];
export declare class GetUsersQueryDto {
    search_word?: string;
    skip?: number;
    limit?: number;
    order_by?: UsersOrderableColumn;
    order_asc?: boolean;
}
