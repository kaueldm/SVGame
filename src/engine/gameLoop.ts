export class GameLoop {
  private lastTime: number = 0;
  private isRunning: boolean = false;
  private onUpdate: (deltaTime: number) => void;
  private onRender: () => void;

  constructor(onUpdate: (deltaTime: number) => void, onRender: () => void) {
    this.onUpdate = onUpdate;
    this.onRender = onRender;
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop.bind(this));
  }

  public stop() {
    this.isRunning = false;
  }

  private loop(currentTime: number) {
    if (!this.isRunning) return;

    const deltaTime = (currentTime - this.lastTime) / 1000; // em segundos
    this.lastTime = currentTime;

    this.onUpdate(deltaTime);
    this.onRender();

    requestAnimationFrame(this.loop.bind(this));
  }
}
