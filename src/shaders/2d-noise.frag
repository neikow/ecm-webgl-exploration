#version 300 es

precision highp float;

// @import 2d-noise.glsl

out vec4 outColor;
in vec3 v_position;
uniform vec2 u_noiseMultiplier;
uniform vec2 u_positionOffset;

uniform vec3 u_color1;
uniform vec3 u_color2;

void main() {
    vec3 color;
    float x = v_position.x;
    float y = v_position.y;
    color = vec3(cnoise(
        vec2(
            u_positionOffset.x + x * u_noiseMultiplier.x,
            u_positionOffset.y + y * u_noiseMultiplier.y
        )
    ));

    outColor = vec4(mix(u_color1, u_color2, color), 1);
}