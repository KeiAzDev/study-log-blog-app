export function isAdmin(email: string | null | undefined): boolean {
  return email === process.env.ADMIN_EMAIL
}