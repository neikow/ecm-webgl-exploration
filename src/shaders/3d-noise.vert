#version 300 es

in vec3 a_position;
out vec3 v_position;

uniform mat4 u_viewProjection;

void main() {
    gl_Position = u_viewProjection * vec4(
        a_position,
        sin(a_position.y * 10.0 + a_position.x * 5.0 + a_position.z * 2.0) * 0.2 + 1.0
    );


    v_position = a_position;
}