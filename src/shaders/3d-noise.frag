#version 300 es

precision highp float;

out vec4 outColor;
in vec3 v_position;
in vec3 v_normal;

uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_lightDirection;

void main() {
    float diffuse = max(dot(normalize(v_normal), normalize(u_lightDirection)), 0.0);

    vec3 baseColor = mix(u_color1, u_color2, v_position.z);

    vec3 shaded = baseColor * (0.3 + 0.7 * diffuse);

    outColor = vec4(shaded, 1);
}