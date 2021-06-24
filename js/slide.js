export default class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    //Obj que referencia as distâncias. StartX é o clique inicial.
    this.dist = { finalPosition: 0, startX: 0, movement: 0 }
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
  }

  //Método que adiciona cada evento do slide.
  addSlideEvents() {
    this.wrapper.addEventListener('mousedown', this.onStart);
    this.wrapper.addEventListener( 'touchstart', this.onStart);
    this.wrapper.addEventListener('mouseup', this.onEnd);
    this.wrapper.addEventListener('touchend', this.onEnd);
  }

  // bind para todos os métodos que estão em callback. Referenciando o objeto criado pela classe.
  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
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
  }

  // Método que inicia a classe.
  init() {
    this.bindEvents();
    this.addSlideEvents(); 
    this.slidesConfig();
    return this;
  }
}

