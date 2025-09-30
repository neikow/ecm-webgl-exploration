#version 300 es

precision highp float;

out vec4 outColor;
in vec3 v_position;
in vec3 v_normal;
in vec4 v_projectedTexcoord;

uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_lightDirection;
uniform sampler2D u_projectedTexture;

void main() {
    vec3 normal = normalize(v_normal);

    vec3 projectedTexcoord = v_projectedTexcoord.xyz / v_projectedTexcoord.w;

    float currentDepth = projectedTexcoord.z;

    // the 'r' channel has the depth values
    float projectedDepth = texture(u_projectedTexture, projectedTexcoord.xy).r;

    float shadowLight = (projectedDepth <= currentDepth) ? 0.4 : 1.0;

    float diffuse = max(dot(normal, normalize(u_lightDirection)), 0.0);

    vec3 baseColor = mix(u_color1, u_color2, (1.0 + v_position.z) / 2.0);

    vec3 shaded = baseColor * shadowLight * (0.3 + 0.7 * diffuse);

    outColor = vec4(shaded, 1);
}