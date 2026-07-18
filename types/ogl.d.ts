declare module 'ogl' {
  export class Renderer {
    constructor(options?: any);
    gl: WebGL2RenderingContext;
    setSize(width: number, height: number): void;
    render(options: { scene: any; camera?: any }): void;
  }
  export class Program {
    constructor(gl: WebGL2RenderingContext, options?: any);
    uniforms: any;
  }
  export class Mesh {
    constructor(gl: WebGL2RenderingContext, options?: any);
    program: Program;
    geometry: any;
    setParent(parent: any): void;
    draw(options?: any): void;
  }
  export class Triangle {
    constructor(gl: WebGL2RenderingContext);
  }
  export class Color {
    constructor(color?: any);
    set(color: any): void;
  }
}
