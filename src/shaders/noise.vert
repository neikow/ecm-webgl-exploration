#version 300 es

in vec3 a_position;
out vec3 v_position;

void main() {
    gl_Position = vec4(a_position, 1);
    v_position = a_position;
}