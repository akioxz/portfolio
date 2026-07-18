"use client";

import React, { useRef, useEffect, ReactNode, MouseEventHandler } from 'react';
import { Renderer, Program, Mesh, Triangle, Color } from 'ogl';

type ButtonSize = 'sm' | 'md' | 'lg';

export interface SpecularButtonProps {
  children?: ReactNode;
  size?: ButtonSize;
  radius?: number;
  textColor?: string;
  lineColor?: string;
  baseColor?: string;
  intensity?: number;
  shineSize?: number;
  shineFade?: number;
  thickness?: number;
  speed?: number;
  followMouse?: boolean;
  proximity?: number;
  autoAnimate?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const PAD = 20;

const SIZES: Record<ButtonSize, string> = {
  sm: 'text-[0.85rem] px-[22px] py-[10px]',
  md: 'text-[1rem] px-[30px] py-[14px]',
  lg: 'text-[1.15rem] px-10 py-[18px]'
};

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2 uCenter;
uniform vec2 uHalfSize;
uniform float uRadius;
uniform float uAngle;
uniform float uPx;
uniform vec3 uLineColor;
uniform vec3 uBaseColor;
uniform float uIntensity;
uniform float uShineSize;
uniform float uShineFade;
uniform float uThickness;
uniform float uBaseWidth;

out vec4 fragColor;

float sdRoundedRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float shapeSDF(vec2 p) { return sdRoundedRect(p, uHalfSize, uRadius); }

float gaussianLine(float d, float sigma) {
  float x = d / (sigma + 1e-6);
  float k = mix(1.0, 1.6, smoothstep(0.0, 1.5, x));
  return exp(-k * x * x);
}

void main() {
  vec2 p = gl_FragCoord.xy - uCenter;
  float d = shapeSDF(p);
  vec2 L = vec2(cos(uAngle), sin(uAngle));

  float base = (1.0 - smoothstep(0.0, uBaseWidth, abs(d))) * 0.45;

  vec2 nEll = normalize(p / (uHalfSize * uHalfSize) + 1e-6);
  float phi = acos(clamp(abs(dot(nEll, L)), 0.0, 1.0));
  float rim = 1.0 - smoothstep(uShineSize - uShineFade, uShineSize + uShineFade + 1e-4, phi);
  float line = gaussianLine(d, uThickness);
  float edgeClamp = 1.0 - smoothstep(0.5 * uPx, 3.0 * uPx, abs(d));
  float hi = line * rim * edgeClamp * uIntensity;

  vec3 col = uBaseColor * base + uLineColor * hi;
  float a = clamp(base + hi, 0.0, 1.0);
  fragColor = vec4(col, a);
}
`;

// Helper to parse CSS color strings into RGB floats [0..1]
function parseToRgb(colorStr: string): [number, number, number] {
  if (typeof window === 'undefined') return [1, 1, 1];

  // Resolve CSS variables like rgb(var(--teal)) or var(--teal)
  let resolvedColor = colorStr;
  if (colorStr.includes('var(')) {
    const tempEl = document.createElement('div');
    tempEl.style.color = colorStr;
    document.body.appendChild(tempEl);
    resolvedColor = window.getComputedStyle(tempEl).color;
    document.body.removeChild(tempEl);
  }

  // Handle rgb / rgba formats
  const rgbMatch = resolvedColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return [
      parseInt(rgbMatch[1]) / 255,
      parseInt(rgbMatch[2]) / 255,
      parseInt(rgbMatch[3]) / 255
    ];
  }

  // Handle Hex
  if (resolvedColor.startsWith('#')) {
    const hex = resolvedColor.slice(1);
    if (hex.length === 3) {
      return [
        parseInt(hex[0] + hex[0], 16) / 255,
        parseInt(hex[1] + hex[1], 16) / 255,
        parseInt(hex[2] + hex[2], 16) / 255
      ];
    }
    if (hex.length === 6) {
      return [
        parseInt(hex.slice(0, 2), 16) / 255,
        parseInt(hex.slice(2, 4), 16) / 255,
        parseInt(hex.slice(4, 6), 16) / 255
      ];
    }
  }

  return [1, 1, 1]; // Default fallback
}

const SpecularButton = ({
  children = 'Get Started',
  size = 'lg',
  radius = 18,
  textColor = '#f5f5f5',
  lineColor = '#ffffff',
  baseColor = '#525252',
  intensity = 1,
  shineSize = 1.0,
  shineFade = 0.5,
  thickness = 1,
  speed = 0.35,
  followMouse = true,
  proximity = 250,
  autoAnimate = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button'
}: SpecularButtonProps) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const btn = btnRef.current;
    const canvas = canvasRef.current;
    if (!btn || !canvas) return;

    let renderer: Renderer | null = null;
    let gl: WebGL2RenderingContext | null = null;
    let program: Program | null = null;
    let animationFrameId: number;
    let currentAngle = 0;
    let mousePos = { x: 0, y: 0 };
    let isMouseOver = false;

    // Parse colors
    const parsedLineColor = parseToRgb(lineColor);
    const parsedBaseColor = parseToRgb(baseColor);

    try {
      renderer = new Renderer({ canvas, alpha: true, premultipliedAlpha: false });
      gl = renderer.gl;
    } catch (e) {
      console.warn('WebGL not supported for SpecularButton');
      return;
    }

    const geometry = new Triangle(gl);
    program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uCenter: { value: [0, 0] },
        uHalfSize: { value: [0, 0] },
        uRadius: { value: radius },
        uAngle: { value: 0 },
        uPx: { value: 1 },
        uLineColor: { value: parsedLineColor },
        uBaseColor: { value: parsedBaseColor },
        uIntensity: { value: intensity },
        uShineSize: { value: shineSize },
        uShineFade: { value: shineFade },
        uThickness: { value: thickness },
        uBaseWidth: { value: 2.0 }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });

    const handleResize = () => {
      const rect = btn.getBoundingClientRect();
      const w = rect.width + PAD * 2;
      const h = rect.height + PAD * 2;
      canvas.width = w;
      canvas.height = h;
      renderer?.setSize(w, h);

      if (program) {
        program.uniforms.uCenter.value = [w / 2, h / 2];
        program.uniforms.uHalfSize.value = [rect.width / 2, rect.height / 2];
        program.uniforms.uPx.value = 1;
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(btn);
    handleResize();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = -(e.clientY - rect.top - rect.height / 2); // invert y for WebGL coordinates
      mousePos = { x, y };
      isMouseOver = true;
    };

    const handleMouseLeave = () => {
      isMouseOver = false;
    };

    btn.addEventListener('mousemove', handleMouseMove);
    btn.addEventListener('mouseleave', handleMouseLeave);

    const update = () => {
      if (program) {
        let targetAngle = currentAngle;

        if (followMouse && isMouseOver) {
          // Calculate angle from center to mouse position
          targetAngle = Math.atan2(mousePos.y, mousePos.x);
        } else if (autoAnimate) {
          targetAngle += speed * 0.05;
        }

        // Smooth angle interpolation
        currentAngle += (targetAngle - currentAngle) * 0.15;
        program.uniforms.uAngle.value = currentAngle;
      }

      if (renderer) {
        renderer.render({ scene: mesh });
      }

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      btn.removeEventListener('mousemove', handleMouseMove);
      btn.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [radius, lineColor, baseColor, intensity, shineSize, shineFade, thickness, speed, followMouse, autoAnimate]);

  return (
    <button
      ref={btnRef}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center font-mono font-medium overflow-visible bg-surface rounded-md transition-colors ${SIZES[size]} ${className}`}
      style={{ color: textColor }}
    >
      <canvas
        ref={canvasRef}
        className="absolute pointer-events-none z-0"
        style={{
          width: `calc(100% + ${PAD * 2}px)`,
          height: `calc(100% + ${PAD * 2}px)`,
          top: -PAD,
          left: -PAD
        }}
      />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
};

export default SpecularButton;
