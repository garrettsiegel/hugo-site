// import gsap from 'gsap/dist/gsap.js';
// import ScrollToPlugin from 'gsap/ScrollToPlugin';
// import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

class App {
  constructor() {
    console.log('app.js loaded');

    // this.downButton = document.querySelector('.intro__button');
    
    // this.events();
    // this.headerAnimation();
    // this.skillsAnimation();
    this.downButton = document.querySelector('.intro__button');
    this.introImage = document.querySelector('.intro__image');
    this.aboutSkills = document.querySelector('.about__skills');

    if (this.downButton) {
      this.events();
    }
    if (this.introImage) {
      this.headerAnimation();
    }
    if (this.aboutSkills) {
      this.skillsAnimation();
    }
  }

  events = () => {
    this.downButton.addEventListener('click', this.downButtonHandler.bind(this));
  };

  downButtonHandler = () => {
    gsap.to(window, { duration: 1, scrollTo: { y: '.about' }, ease: 'power2.out' });
  };

  headerAnimation = () => {
    const tl = gsap.timeline();
    tl.from('.intro__image', { duration: 2, opacity: 0, ease: 'power1' }, '+=0.5');
    tl.from('.intro__overline', { duration: 1, opacity: 0, ease: 'power1' }, '-=1.5');
    tl.from('.intro__name', { duration: 1, opacity: 0, ease: 'power1' }, '-=1');
    tl.from('.intro__desc', { duration: 1, opacity: 0, ease: 'power1' });
    tl.from('.intro__button', { duration: 1, opacity: 0, ease: 'power1' }, '-=1');
  };

  skillsAnimation = () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.about__skills',
        start: 'top 80%',
        end: 'bottom 55%',
        scrub: 1,
        // markers: true
      }
    });
    tl.from('.about__headline', { opacity: 0, y: 20 });

    const skillsArray = Array.from(document.querySelectorAll('.about__skill'));
    skillsArray.sort(() => Math.random() - 0.2);
    skillsArray.forEach((skill) => {
      tl.from(skill, { opacity: 0, scale: 0.75 }, '-=0.25');
    });
  };
}

new App();
