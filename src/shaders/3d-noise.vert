#version 300 es

in vec3 a_position;
out vec3 v_position;
out vec3 v_normal;
out vec4 v_projectedTexcoord;

// @import 2d-noise.glsl

struct NoiseParams {
    vec2 offset;
    vec2 frequency;
    float contribution;
};

const int MAX_NUM_NOISES = 16;
const int NOISE_PARAMS_SIZE = 2 + 2 + 1; // vec2 + vec2 + float

uniform float u_noises[MAX_NUM_NOISES * NOISE_PARAMS_SIZE];

uniform float u_maxTerrainHeight;
uniform float u_minTerrainHeight;

uniform float u_normalEpsilon;
uniform vec2 u_planeScale;

uniform mat4 u_viewMatrix;
uniform mat4 u_projectionMatrix;

uniform mat4 u_textureMatrix;

float createNoiseAtPosition(vec2 pos, NoiseParams params, float totalContribution) {
    return cnoise(
        vec2(
            pos.x * params.frequency.x + params.offset.x,
            pos.y * params.frequency.y + params.offset.y
        )
    ) * params.contribution / totalContribution;
}

NoiseParams getNoise(int index) {
    int base = index * NOISE_PARAMS_SIZE;
    return NoiseParams(
        vec2(u_noises[base+0], u_noises[base+1]),
        vec2(u_noises[base+2], u_noises[base+3]),
        u_noises[base+4]
    );
}

float getNormalizedHeight(vec2 pos) {
    float height = 0.0;
    float totalContribution = 0.0;
    for (int i = 0; i < MAX_NUM_NOISES; i++) {
        NoiseParams params = getNoise(i);
        if (params.frequency.x == 0.0 && params.frequency.y == 0.0) {
            break;
        }
        totalContribution += params.contribution;
    }

    for (int i = 0; i < MAX_NUM_NOISES; i++) {
        NoiseParams params = getNoise(i);
        if (params.frequency.x == 0.0 && params.frequency.y == 0.0) {
            break;
        }
        height += createNoiseAtPosition(pos, params, totalContribution);
    }
    return height;
}

void main() {
    float x = a_position.x;
    float y = a_position.y;

    float z = getNormalizedHeight(a_position.xy);

    float dX = (getNormalizedHeight(vec2(x + u_normalEpsilon, y)) - z) / u_normalEpsilon;
    float dY = (getNormalizedHeight(vec2(x, y + u_normalEpsilon)) - z) / u_normalEpsilon;

    vec3 normal = normalize(vec3(-dX, -dY, 1.0));

    vec3 scaledNormal = normalize(vec3(
        normal.x / u_planeScale.x,
        normal.y / u_planeScale.y,
        normal.z
    ));

    vec4 worldPosition = mat4(
        u_planeScale.x, 0.0, 0.0, 0.0,
        0.0, u_planeScale.y, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ) * vec4(
        a_position.xy,
        (1.0 + z) * (u_maxTerrainHeight - u_minTerrainHeight) + u_minTerrainHeight,
        1.0
    );

    gl_Position =  u_projectionMatrix * u_viewMatrix * worldPosition;

    v_projectedTexcoord = u_textureMatrix * worldPosition;
    v_position = vec3(gl_Position.xy, z);
    v_normal = scaledNormal;
}