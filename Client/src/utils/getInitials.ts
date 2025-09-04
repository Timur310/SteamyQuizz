// Utility to get initials from a username (e.g., "John Doe" => "JD", "Alice" => "A")
export function getInitials(username: string): string {
  if (!username) return "";
  const words = username.trim().split(/\s+/);
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}
