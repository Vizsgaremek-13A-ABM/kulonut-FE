import Role from "./role.interface";

export default interface User{
    id: number,
    name: string,
    display_name: string|null,
    email: string,
    avatar: string,
    role: Role,
    joined_at: Date|string
}