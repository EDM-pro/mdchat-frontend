/**
 * Avatar URL'ini döndürür.
 * Cloudinary URL'leri direkt kullanılır,
 * diğerleri backend base URL'i ile birleştirilir.
 */
export const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) return null;
  // Tam URL ise (Cloudinary, http/https) direkt döndür
  if (avatarPath.startsWith('http')) return avatarPath;
  // Relative path ise backend URL'i ekle
  const backendUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
  return `${backendUrl}${avatarPath}`;
};

/**
 * Kullanıcı adının ilk harfini döndürür (avatar placeholder)
 */
export const getInitial = (username) => {
  return username?.[0]?.toUpperCase() || '?';
};
