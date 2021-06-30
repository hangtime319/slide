import debounce from './debounce.js';

export class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    //Obj que referencia as distâncias. StartX é o clique inicial.
    this.dist = { finalPosition: 0, startX: 0, movement: 0 }
    this.activeClass = 'active';
  }

  // Efeito de transição dos elementos do slide.
  transition(active) {
    this.slide.style.transition = active ? 'transform .3s' : '';
  }

  //Método que faz mover o Slide.
  moveSlide(distX) {
    //Salvar a ultima distância.
    this.dist.movePosition = distX
    this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
  }

  //Atualiza o posicionamento do evento do mouse.
  updatePosition(clientX) {
    this.dist.movement = (this.dist.startX - clientX) * 1.6;
    return this.dist.finalPosition - this.dist.movement;
  }

  //Método que inicia o evento do mouse.
  onStart(event) {
    let movetype;
    if (event.type === 'mousedown'){
      event.preventDefault();
      this.dist.startX = event.clientX;
      movetype = 'mousemove'
    } else {
      this.dist.startX = event.changedTouches[0].clientX;
      movetype = 'touchmove';
    }
    this.wrapper.addEventListener(movetype, this.onMove);
    this.transition(false);
  }

  // Método que adiciona o evento move do mouse, ou seja, quando mover o mouse.
  onMove(event) {
    const pointerPosition = (event.type === 'mousemove') ? event.clientX : event.changedTouches[0].clientX;
    const finalPosition = this.updatePosition(pointerPosition);
    this.moveSlide(finalPosition);
  }

  //Método que termina o evento.
  onEnd(event) {
    const movetype = (event.type === 'mouseup') ? 'mousemove' : 'touchmove';
    this.wrapper.removeEventListener(movetype, this.onMove);
    this.dist.finalPosition = this.dist.movePosition;
    this.transition(true);
    this.changeSlideOnEnd();    
  }

  // Troca o slide quando acabar de mover o mouse.
  changeSlideOnEnd() {
    if (this.dist.movement > 120 && this.index.next !== undefined) {
      this.activeNextSlide();
    } else if (this.dist.movement < -120 && this.index.prev !== undefined) {
      this.activePrevSlide(); 
    } else {
      this.changeSlide(this.index.active)
    }
  }

  //Método que adiciona cada evento do slide.
  addSlideEvents() {
    this.wrapper.addEventListener('mousedown', this.onStart);
    this.wrapper.addEventListener( 'touchstart', this.onStart);
    this.wrapper.addEventListener('mouseup', this.onEnd);
    this.wrapper.addEventListener('touchend', this.onEnd);
  }

  // Slides Config.

  // Calcula a posição do elemento para colocá-lo no centro.
  slidePosition(slide) {
    const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
    return -(slide.offsetLeft - margin);
  }

  slidesConfig() {
    this.slideArray = [...this.slide.children].map((element) => {
      const position = this.slidePosition(element);
      return { position, element }
    });
  }

  // Index da navegação dos slides.
  slidesIndexNav(index) {
    const last = this.slideArray.length - 1;
    this.index = {
      prev: index ? index - 1 : undefined,
      active: index,
      next: index === last ? undefined : index + 1,
    }
  }
 
  // Muda o slide de acordo com o index que é passado.
  changeSlide(index) {
    const activeSlide = this.slideArray[index]
    this.moveSlide(this.slideArray[index].position)
    this.slidesIndexNav(index);
    this.dist.finalPosition = activeSlide.position;
    this.changeActiveClass();
  }

  // Ativar classe active para aplicar o efeito.
  changeActiveClass() {
    this.slideArray.forEach(item => item.element.classList.remove(this.activeClass));
    this.slideArray[this.index.active].element.classList.add(this.activeClass);
  }

  // Ativar o Slide anterior.
  activePrevSlide() {
    if(this.index.prev !== undefined) this.changeSlide(this.index.prev);
  }

  // Ativar o Slide próximo.
  activeNextSlide() {
    if(this.index.next !== undefined) this.changeSlide(this.index.next);
  }

  // Quando houver um resize da tela, re-atualizar as configurações.
  onResize() {
    setTimeout(() => {
      this.slidesConfig();
      this.changeSlide(this.index.active);
    }, 1000);    
  }

  addResizeEvent() {
    window.addEventListener('resize', this.onResize);
  }

  // bind para todos os métodos que estão em callback. Referenciando o objeto criado pela classe.
  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.activePrevSlide = this.activePrevSlide.bind(this);
    this.activeNextSlide = this.activeNextSlide.bind(this);
    this.onResize = debounce(this.onResize.bind(this), 200);
    
  }

  // Método que inicia a classe.
  init() {
    this.bindEvents();
    this.transition(true);
    this.addSlideEvents(); 
    this.slidesConfig();
    this.addResizeEvent();
    this.changeSlide(0);
    return this;
  }
}

export class SlideNav extends Slide {
  // Navegação das imagens para frente e para trás.
  addArrow(prev, next) {
    this.prevElement = document.querySelector('.prev');
    this.nextElement = document.querySelector('.next');
    this.addArrowEvent();
  }

  // Adiciona os eventos a navegação.
  addArrowEvent() {
    this.prevElement.addEventListener('click', this.activePrevSlide);
    this.nextElement.addEventListener('click', this.activeNextSlide);
  }
}

