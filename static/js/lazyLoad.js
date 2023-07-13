class LazyLoad {
  constructor() {
    this.setupVariables();
    this.checkIntersectionObserver();
  }

  setupVariables = () => {
    const allItems = [...document.querySelectorAll('[data-mobile-src], [data-desktop-src], [data-src], video')];
    this.allLazyItems = allItems.filter(item => !item.classList.contains('no-lazy'));
    this.gridLazyItems = this.allLazyItems.filter(item => item.closest('.grid-item'));
    this.loadedItemsCount = 0;
    this.loadedGridItemsCount = 0;
    this.viewportHeight = window.innerHeight;
    this.rootMargin = `${this.viewportHeight * 2.5}px 0px`;
  }
  

  checkIntersectionObserver = () => {
    if ('IntersectionObserver' in window) {
      this.initIntersectionObserver();
    } else {
      window.addEventListener('scroll', this.fallbackLazyLoad);
    }
  }

  initIntersectionObserver = () => {
    this.intersectionObserver = new IntersectionObserver(this.loadItem, { rootMargin: this.rootMargin });
    this.allLazyItems.forEach(item => this.intersectionObserver.observe(item));
  }

  loadItem = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadContent(entry.target);
        observer.unobserve(entry.target);
        entry.target.addEventListener('load', this.imageLoaded);
      }
    });
  }

  imageLoaded = () => {
    window.dispatchEvent(new Event('imageLoaded'));
  }

  loadContent = (target) => {
    const isMobile = window.innerWidth <= 768;
    const src = target.dataset.src || (isMobile ? target.dataset.mobileSrc : target.dataset.desktopSrc);
    const poster = isMobile ? target.dataset.mobilePoster : target.dataset.desktopPoster;
    const loadFunc = { 'video': this.loadVideo, 'img': this.loadImage }[target.tagName.toLowerCase()];

    loadFunc && loadFunc(target, src, poster);
    this.incrementLoadedItems(target);
  }

  incrementLoadedItems = (target) => {
    this.loadedItemsCount += 1;
    if (target.closest('.grid-item')) {
      this.loadedGridItemsCount += 1;
      if (this.loadedGridItemsCount === Math.ceil(this.gridLazyItems.length / 2)) {
        document.dispatchEvent(new CustomEvent('halfgriditemsloaded'));
      }
    }

    if (this.loadedItemsCount === this.allLazyItems.length) {
      document.dispatchEvent(new CustomEvent('lazyloadingdone'));
    }
  }

  loadImage = (image, src) => {
    image.src = src;
    image.onerror = () => console.error('Error loading image:', src);
  }

  loadVideo = (video, src, poster) => {
    video.src = src;
    video.poster = poster;
    video.load();
    video.onerror = () => console.error('Error loading video:', src);
  }

  fallbackLazyLoad = () => {
    this.allLazyItems.filter(this.isElementInViewport).forEach(item => this.loadContent(item));
  }

  isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
           rect.left <= (window.innerWidth || document.documentElement.clientWidth);
  }
}

export default LazyLoad;
