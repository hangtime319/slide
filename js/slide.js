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
    event.preventDefault();
    this.dist.startX = event.clientX;
    this.wrapper.addEventListener('mousemove', this.onMove);
  }

  // Método que adiciona o evento move do mouse, ou seja, quando mover o mouse.
  onMove(event) {
    const finalPosition = this.updatePosition(event.clientX);
    this.moveSlide(finalPosition);
  }

  //Método que termina o evento.
  onEnd(event) {
    this.wrapper.removeEventListener('mousemove', this.onMove);
    this.dist.finalPosition = this.dist.movePosition;
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

