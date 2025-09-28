#version 300 es

in vec3 a_position;
out vec3 v_position;

// @import 2d-noise.glsl

uniform vec2 u_planeScale;
uniform vec2 u_noiseMultiplier;
uniform vec2 u_positionOffset;
uniform mat4 u_viewProjection;
uniform float u_noiseHeight;

void main() {
    float x = a_position.x;
    float y = a_position.y;

    float z = cnoise(
        vec2(
            u_positionOffset.x + x * u_noiseMultiplier.x,
            u_positionOffset.y + y * u_noiseMultiplier.y
        )
    ) * u_noiseHeight;

    gl_Position = mat4(
        u_planeScale.x, 0.0, 0.0, 0.0,
        0.0, u_planeScale.y, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ) * u_viewProjection * vec4(
        a_position.xy,
        z,
        1
    );

    v_position = vec3(gl_Position.xy, z);
}