import { useEffect, useRef } from "react";
import * as THREE from "three";

const COUNT = 9000;
const WORLD_H = 5.6; // hauteur de l'image dans la scène
const rand = (a: number, b: number) => a + Math.random() * (b - a);

/** Lit l'image et tire COUNT points, plus nombreux là où elle est claire. */
async function sampleImage(src: string): Promise<Float32Array> {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = src;
  await img.decode();

  const W = 220;
  const H = Math.max(1, Math.round((img.naturalHeight / img.naturalWidth) * W));
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext("2d");
  if (!ctx) throw new Error("canvas indisponible");
  ctx.drawImage(img, 0, 0, W, H);
  const data = ctx.getImageData(0, 0, W, H).data;

  const worldW = WORLD_H * (W / H);
  const out = new Float32Array(COUNT * 3);
  let n = 0;
  let guard = 0;
  while (n < COUNT && guard < COUNT * 300) {
    guard++;
    const px = Math.floor(Math.random() * W);
    const py = Math.floor(Math.random() * H);
    const i = (py * W + px) * 4;
    const lum = (data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11) / 255;
    const v = lum * (data[i + 3] / 255); // alpha prise en compte (PNG transparent)
    if (Math.random() < v * v) {
      out[n * 3] = (px / W - 0.5) * worldW;
      out[n * 3 + 1] = -(py / H - 0.5) * WORLD_H;
      out[n * 3 + 2] = rand(-0.3, 0.3) * v;
      n++;
    }
  }
  for (; n < COUNT; n++) {
    out[n * 3] = rand(-1, 1);
    out[n * 3 + 1] = rand(-1, 1);
    out[n * 3 + 2] = 0;
  }
  return out;
}

/** Plan B si l'image ne charge pas : une sphère. */
function sphereTargets(): Float32Array {
  const out = new Float32Array(COUNT * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < COUNT; i++) {
    const y = 1 - (i / (COUNT - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    out[i * 3] = Math.cos(golden * i) * r * 2.3;
    out[i * 3 + 1] = y * 2.3;
    out[i * 3 + 2] = Math.sin(golden * i) * r * 2.3;
  }
  return out;
}

type Props = {
  src: string; // ex. "/portrait.png" (fichier dans public/), idéalement clair sur fond sombre ou transparent
  offsetX?: number; // décale l'image vers la gauche (négatif) ou la droite
  burstKey?: number; // change cette valeur pour faire « exploser » puis reformer les particules
};

export function ParticleImage({ src, offsetX = 0, burstKey = 0 }: Props) {
  const mount = useRef<HTMLDivElement>(null);
  const burst = useRef(false);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    burst.current = true;
  }, [burstKey]);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.z = 7;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    const pos = new Float32Array(COUNT * 3);
    const vel = new Float32Array(COUNT * 3);
    const target = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = rand(-8, 8);
      pos[i * 3 + 1] = rand(-5, 5);
      pos[i * 3 + 2] = rand(-3, 3);
      target[i * 3] = pos[i * 3];
      target[i * 3 + 1] = pos[i * 3 + 1];
      target[i * 3 + 2] = pos[i * 3 + 2];
    }

    // Gris clairs avec ~7 % de points violets, comme sur la référence
    const colors = new Float32Array(COUNT * 3);
    const col = new THREE.Color();
    for (let i = 0; i < COUNT; i++) {
      if (Math.random() < 0.07) col.set("#5b4bff");
      else {
        const g = rand(0.55, 0.95);
        col.setRGB(g, g, g);
      }
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: 0.028,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let alive = true;
    const applyTargets = (t: Float32Array) => {
      if (!alive) return;
      for (let i = 0; i < t.length; i++) target[i] = t[i] + (i % 3 === 0 ? offsetX : 0);
    };
    sampleImage(src).then(applyTargets).catch(() => applyTargets(sphereTargets()));

    // Curseur → coordonnées dans la scène
    const mouse = { x: 999, y: 999 };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = -(((e.clientY - r.top) / r.height) * 2 - 1);
      const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      mouse.x = nx * halfH * camera.aspect;
      mouse.y = ny * halfH;
    };
    window.addEventListener("pointermove", onMove);

    const resize = () => {
      const w = el.clientWidth || window.innerWidth;
      const h = el.clientHeight || window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    const R = 1.1;
    const R2 = R * R;
    const clock = new THREE.Clock();
    let raf = 0;

    const tick = () => {
      if (reduced) {
        pos.set(target);
      } else {
        if (burst.current) {
          burst.current = false;
          for (let i = 0; i < vel.length; i++) vel[i] += rand(-0.35, 0.35);
        }
        for (let i = 0; i < COUNT; i++) {
          const ix = i * 3;
          let vx = vel[ix];
          let vy = vel[ix + 1];
          let vz = vel[ix + 2];
          const px = pos[ix];
          const py = pos[ix + 1];

          // rappel vers la forme
          vx += (target[ix] - px) * 0.015;
          vy += (target[ix + 1] - py) * 0.015;
          vz += (target[ix + 2] - pos[ix + 2]) * 0.015;

          // répulsion + tourbillon autour du curseur
          const dx = px - mouse.x;
          const dy = py - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R2 && d2 > 1e-6) {
            const d = Math.sqrt(d2);
            const f = 1 - d / R;
            const s = f * f * 0.12;
            vx += (dx / d) * s - (dy / d) * s * 0.6;
            vy += (dy / d) * s + (dx / d) * s * 0.6;
          }

          vel[ix] = vx * 0.9;
          vel[ix + 1] = vy * 0.9;
          vel[ix + 2] = vz * 0.9;
          pos[ix] += vel[ix];
          pos[ix + 1] += vel[ix + 1];
          pos[ix + 2] += vel[ix + 2];
        }
        points.rotation.y = Math.sin(clock.getElapsedTime() * 0.4) * 0.12;
      }
      geometry.getAttribute("position").needsUpdate = true;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      ro.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, [src, offsetX]);

  return (
    <div
      ref={mount}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
}