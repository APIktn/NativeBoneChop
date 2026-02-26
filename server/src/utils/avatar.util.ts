export function generateAvatar(
  first: string,
  last: string,
): string {

  const initials = `${first[0]}${last[0]}`.toUpperCase()

  const colors = [
    '007bff',
    '28a745',
    'dc3545',
    'ffc107',
    '17a2b8',
    '6610f2',
    'fd7e14',
    '20c997',
    'e83e8c',
    '6f42c1',
  ]

  const backgroundColor =
    colors[Math.floor(Math.random() * colors.length)]

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    initials,
  )}&background=${backgroundColor}&color=ffffff`
}
