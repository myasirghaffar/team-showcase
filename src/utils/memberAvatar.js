export function getMemberAvatarUrl(member) {
  const url = member?.avatar?.trim()
  if (url) return url

  const name = encodeURIComponent(member?.name || 'Unknown')
  return `https://ui-avatars.com/api/?name=${name}&background=dc2626&color=fff&size=256`
}
