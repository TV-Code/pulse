export const pulseVertex = `
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const pulseFragment = `
  uniform float time;
  uniform float opacity;
  uniform vec3 color;
  varying vec2 vUv;
  
  void main() {
    float strength = distance(vUv, vec2(0.5));
    float alpha = opacity * (1.0 - strength);
    alpha *= 1.0 + sin(time * 2.0) * 0.2;
    
    gl_FragColor = vec4(color, alpha);
  }
`;