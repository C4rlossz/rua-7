// Discover the home campaign before the React bundle; other routes avoid the download.
if (location.pathname === '/') {
  const preload = document.createElement('link');
  preload.rel = 'preload'; preload.as = 'image';
  preload.href = '/images/campaign-optimized.jpg';
  preload.imageSrcset = '/images/campaign-mobile.jpg 768w, /images/campaign-optimized.jpg 1536w';
  preload.imageSizes = '100vw'; preload.fetchPriority = 'high';
  document.head.append(preload);
}
