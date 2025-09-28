#version 300 es

in vec3 a_position;
out vec3 v_position;
out vec3 v_normal;

// @import 2d-noise.glsl

uniform vec2 u_planeScale;
uniform vec2 u_noiseMultiplier;
uniform vec2 u_positionOffset;
uniform mat4 u_viewProjection;
uniform float u_noiseHeight;

float getHeight(vec2 pos) {
    return (
        cnoise(
            vec2(
                    u_positionOffset.x + pos.x * u_noiseMultiplier.x,
                    u_positionOffset.y + pos.y * u_noiseMultiplier.y
                )
        ) * 0.5 + cnoise(
            vec2(
                u_positionOffset.x * 2.0 + pos.x * u_noiseMultiplier.x * 2.0,
                u_positionOffset.y * 2.0 + pos.y * u_noiseMultiplier.y * 2.0
            )
        ) * 0.25 + cnoise(
            vec2(
                u_positionOffset.x * 4.0 + pos.x * u_noiseMultiplier.x * 4.0,
                u_positionOffset.y * 4.0 + pos.y * u_noiseMultiplier.y * 4.0
            )
        ) * 0.125 + cnoise(
            vec2(
                u_positionOffset.x * 8.0 + pos.x * u_noiseMultiplier.x * 8.0,
                u_positionOffset.y * 8.0 + pos.y * u_noiseMultiplier.y * 8.0
                )
            ) * 0.125
    ) * u_noiseHeight;
}

void main() {
    float x = a_position.x;
    float y = a_position.y;

    float z = getHeight(a_position.xy);

    float epsilon = 0.01;

    float dX = (getHeight(vec2(x + epsilon, y)) - z) / epsilon;
    float dY = (getHeight(vec2(x, y + epsilon)) - z) / epsilon;

    vec3 normal = normalize(vec3(-dX, -dY, 1.0));

    vec3 scaledNormal = normalize(vec3(
        normal.x / u_planeScale.x,
        normal.y / u_planeScale.y,
        normal.z
    ));

    gl_Position = u_viewProjection * mat4( // <- model matrix
        u_planeScale.x, 0.0, 0.0, 0.0,
        0.0, u_planeScale.y, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ) * vec4(
        a_position.xy,
        z,
        1
    );

    v_position = vec3(gl_Position.xy, z);
    v_normal = scaledNormal;
}