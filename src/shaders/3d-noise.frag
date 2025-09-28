#version 300 es

precision highp float;

out vec4 outColor;
in vec3 v_position;

uniform vec3 u_color1;
uniform vec3 u_color2;

void main() {
    float z = v_position.z;
    outColor = vec4(mix(u_color1, u_color2, z), 1);
}