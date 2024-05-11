import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const fragmentShader = `
uniform float iTime;
varying vec2 vUv;

vec3 palette(float t) {
    vec3 a = vec3(1.198, 0.628, -0.092);
    vec3 b = vec3(1.420, -0.259, 0.843);
    vec3 c = vec3(0.816, 5.712, 3.874);
    vec3 d = vec3(-1.523, -0.453, 0.047);
    return a + b*cos(6.28318*(c*t+d));
}

float sdPentagon( in vec2 p, in float r )
{
    const vec3 k = vec3(0.809016994,0.587785252,0.726542528);
    p.x = abs(p.x);
    p -= 2.0*min(dot(vec2(-k.x,k.y),p),0.0)*vec2(-k.x,k.y);
    p -= 2.0*min(dot(vec2( k.x,k.y),p),0.0)*vec2( k.x,k.y);
    p -= vec2(clamp(p.x,-r*k.z,r*k.z),r);    
    return length(p)*sign(p.y);
}

float sdHexagram( in vec2 p, in float r )
{
    const vec4 k = vec4(-0.5,0.8660254038,0.5773502692,1.7320508076);
    p = abs(p);
    p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;
    p -= 2.0*min(dot(k.yx,p),0.0)*k.yx;
    p -= vec2(clamp(p.x,r*k.z,r*k.w),r);
    return length(p)*sign(p.y);
}
float dot2( in vec2 v ) { return dot(v,v); }

float sdHeart( in vec2 p )
{
    p.x = abs(p.x);

    if( p.y+p.x>1.0 ) {
        return sqrt(dot2(p-vec2(0.25,0.75))) - sqrt(2.0)/4.0;
    }
    return sqrt(min(dot2(p-vec2(0.00,1.00)), dot2(p-0.5*max(p.x+p.y,0.0)))) * sign(p.x-p.y);
}

float sdfCoolS( in vec2 p )
{
    float six = (p.y<0.0) ? -p.x : p.x;
    p.x = abs(p.x);
    p.y = abs(p.y) - 0.2;
    float rex = p.x - min(round(p.x/0.4),0.4);
    float aby = abs(p.y-0.2)-0.6;
    
    float d = dot2(vec2(six,-p.y)-clamp(0.5*(six-p.y),0.0,0.2));
    d = min(d,dot2(vec2(p.x,-aby)-clamp(0.5*(p.x-aby),0.0,0.4)));
    d = min(d,dot2(vec2(rex,p.y  -clamp(p.y          ,0.0,0.4))));
    
    float s = 2.0*p.x + aby + abs(aby+0.4) - 0.4;
    return sqrt(d) * sign(s);
}

void main() { 
  vec2 uvv = vUv*2.0 - 1.0;
  vec2 uvv0 = uvv;
  vec3 finalColor = vec3(0.0);

  for(float i=0.0; i< 2.0; i++) {
    uvv = fract(uvv *1.5) - 0.5;

    float d = sdfCoolS((uvv));

    vec3 col = palette(length(uvv0) + i*.4 +iTime*.2);

    d = sin(d*6. + iTime*(i*.93))/4.02;
    d = abs(d);


    d = pow(0.01 / d, 1.2);

    finalColor += col *d;
  }

  gl_FragColor = vec4(finalColor, 1.0);
}
`;
const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
}
`;

const uniforms = {
    iTime: { value: 0 },
};

const Cube = () => {
    const mesh = useRef();
    useFrame(() => {
        uniforms.iTime.value += 0.01;
    });
    return (
        <mesh ref={mesh} position={[0, 0, 0]} scale={2.0}>
            <planeGeometry />
            <shaderMaterial
                fragmentShader={fragmentShader}
                vertexShader={vertexShader}
                uniforms={uniforms}
            />
        </mesh>
    );
};

export default Cube;
