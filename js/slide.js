export default class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
  }

  //Método que inicia o evento do mouse.
  onStart(event) {
    event.preventDefault();
    this.wrapper.addEventListener('mousemove', this.onMove);
  }

  // Método que adiciona o evento move do mouse, ou seja, quando mover o mouse.
  onMove(event) {

  }

  //Método que termina o evento.
  onEnd(event) {
    this.wrapper.removeEventListener('mousemove', this.onMove);
  }

  //Método que adiciona cada evento do slide.
  addSlideEvents() {
    this.wrapper.addEventListener('mousedown', this.onStart);
    this.wrapper.addEventListener('mouseup', this.onEnd);
  }

  // bind para todos os métodos que estão em callback. Referenciando o objeto criado pela classe.
  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  // Método que inicia a classe.
  init() {
    this.bindEvents();
    this.addSlideEvents();    
    return this;
  }
}

