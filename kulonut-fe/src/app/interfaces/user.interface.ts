export default interface User{
    id: number,
    name: string,
    display_name: string,
    email: string,
    avatar: string,
    role: number,
    joined_at: Date|string
}