import * as THREE from 'three';

export async function createCRT() {
  const picture = await new THREE.TextureLoader().loadAsync('./crt-screen.png');
  picture.flipY = false;
  picture.colorSpace = THREE.SRGBColorSpace;
  return new THREE.ShaderMaterial({
    name: 'Monochrome CRT',
    uniforms: { picture: { value: picture }, time: { value: 0 } },
    vertexShader: `
      varying vec2 screenUv;
      void main() {
        screenUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D picture;
      uniform float time;
      varying vec2 screenUv;
      float noise(vec2 point) {
        return fract(sin(dot(point, vec2(12.9898, 78.233))) * 43758.5453);
      }
      void main() {
        vec2 p = screenUv * 2.0 - 1.0;
        vec2 curved = p * (1.0 + 0.045 * dot(p, p));
        // Preserve the circular artwork on the model's nearly square glass.
        vec2 uv = curved * vec2(0.3984, 0.5) + 0.5;
        vec3 color = texture2D(picture, uv).rgb;
        vec3 glow = texture2D(picture, uv + vec2(0.004, 0.0)).rgb
                  + texture2D(picture, uv - vec2(0.004, 0.0)).rgb
                  + texture2D(picture, uv + vec2(0.0, 0.004)).rgb
                  + texture2D(picture, uv - vec2(0.0, 0.004)).rgb;
        color = color * 1.12 + glow * 0.055;
        float scanline = 0.83 + 0.17 * sin(screenUv.y * 720.0);
        float sweep = exp(-pow((fract(screenUv.y - time * 0.09) - 0.5) * 13.0, 2.0));
        color *= scanline * (0.98 + sweep * 0.045);
        color *= 1.0 - 0.32 * pow(length(p) / 1.4142, 2.0);
        // Soft rounded black edges and a faint reflection on the glass.
        vec2 q = abs(p) - vec2(0.90);
        float edge = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - 0.075;
        float mask = 1.0 - smoothstep(-0.012, 0.012, edge);
        float reflection = exp(-dot((p - vec2(-0.50, -0.70)) * vec2(1.1, 3.2), (p - vec2(-0.50, -0.70)) * vec2(1.1, 3.2)));
        color += vec3(0.045, 0.055, 0.04) * reflection;
        float grain = noise(floor(screenUv * vec2(320.0, 240.0)) + floor(time * 12.0));
        float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));
        luminance = max(0.0, luminance + (grain - 0.5) * 0.055);
        gl_FragColor = vec4(vec3(mix(0.005, luminance, mask)), 1.0);
        #include <colorspace_fragment>
      }
    `,
  });
}
