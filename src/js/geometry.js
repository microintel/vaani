// Small landmark maths helpers.

export const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

// MediaPipe landmarks are normalised per axis (x by width, y by height), which squashes
// horizontal distances on a 4:3 camera. Scale x back so distances are true in every direction.
export const toAspect = (lm, aspect) => lm.map(p => ({ x: p.x * aspect, y: p.y, z: p.z }));
