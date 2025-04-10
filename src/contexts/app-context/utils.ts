import { type TPoint } from './types'

/**
 * Generates a version 4 UUID (Universally Unique Identifier).
 * UUIDs are 36-character strings formatted as `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`
 * where `x` is a hexadecimal digit and `y` is one of `8`, `9`, `a`, or `b`.
 *
 * @returns A randomly generated UUID v4 string.
 */
export function uuidv4(): string {
  const hexDigits = '0123456789abcdef'
  let uuid = ''

  for (let i = 0; i < 36; i += 1) {
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      uuid += '-' // Hyphen separators at specific positions
    } else if (i === 14) {
      uuid += '4' // UUID version (4)
    } else if (i === 19) {
      uuid += hexDigits[Math.floor(Math.random() * 4) + 8] // Generates 8, 9, a or b
    } else {
      uuid += hexDigits[Math.floor(Math.random() * 16)] // Random hex digit
    }
  }

  return uuid
}

/**
 * The function `positionToHSL` converts 3D coordinates into an HSL color value.
 * @param x - The `x` parameter represents the horizontal position in a 3D space.
 * @param y - The `y` parameter represents the vertical position in a 3D space. It is used to calculate
 * the hue value by interpolating between yellow and blue (60 to 240 degrees).
 * @param z - The `z` parameter represents the depth position in a 3D space. It helps determine the hue
 * by interpolating between magenta and cyan (300 to 180 degrees).
 * @returns An HSL color string based on the average hue derived from the 3D position, with a fixed
 * saturation of 70% and lightness of 50%.
 */
export function positionToHSL(x: number, y: number, z: number): string {
  // Ensure values are clamped between -1 and 1
  x = Math.max(-1, Math.min(1, x))
  y = Math.max(-1, Math.min(1, y))
  z = Math.max(-1, Math.min(1, z))

  // Hue interpolation for each axis
  const hueX = ((x + 1) / 2) * 120 // Red (0) ↔ Green (120)
  const hueY = ((y + 1) / 2) * 180 + 60 // Yellow (60) ↔ Blue (240)
  const hueZ = ((z + 1) / 2) * 120 + 300 // Magenta (300) ↔ Cyan (180)
  const hueZWrapped = hueZ % 360 // Ensure hue stays within 0–360°

  // Circular average
  const hues = [hueX, hueY, hueZWrapped]
  const radians = hues.map((h) => (h * Math.PI) / 180)
  const avgSin = radians.reduce((sum, r) => sum + Math.sin(r), 0) / 3
  const avgCos = radians.reduce((sum, r) => sum + Math.cos(r), 0) / 3
  let avgHue = (Math.atan2(avgSin, avgCos) * 180) / Math.PI
  if (avgHue < 0) avgHue += 360

  return `hsl(${avgHue.toFixed(2)}, 70%, 50%)`
}

/**
 * Generates 3D points to form a sphere using circular slices, where the number of points
 * per circle varies progressively: maximum at the equator and minimum at the poles.
 *
 * @param maxPoints - Maximum number of points on a circle (e.g., at the equator)
 * @param minPoints - Minimum number of points on a circle (e.g., at the poles, recommended 1)
 * @param circlesCount - Number of circular slices (latitudes) forming the sphere
 * @param sphereRadius - Radius of the sphere
 * @returns An array of 3D points representing the sphere's surface, each with spherical coordinates (theta, phi).
 */
export function generateVariableSpherePoints(
  maxPoints: number,
  minPoints: number,
  circlesCount: number,
  sphereRadius: number
): TPoint[] {
  const points: TPoint[] = []

  // Iterate over each latitude, from 0 (north pole) to π (south pole)
  for (let i = 0; i < circlesCount; i += 1) {
    const theta = (Math.PI * i) / (circlesCount - 1)
    const thetaDeg = (theta * 180) / Math.PI
    const y = sphereRadius * Math.cos(theta)
    // The radius of the circle in the XZ plane:
    const circleRadius = sphereRadius * Math.sin(theta)

    // Calculate the number of points for this circle.
    // Linearly interpolated: when sin(theta)=1 (e.g., equator) use maxPoints,
    // and when sin(theta)=0 (poles) use minPoints.
    const pointsForCircle =
      circleRadius === 0
        ? 1 // Always at least one point at the poles
        : Math.max(1, Math.round(minPoints + (maxPoints - minPoints) * Math.sin(theta)))

    // If the radius is zero (pole), add a single point
    if (circleRadius === 0) {
      points.push({ x: 0, y, z: 0, theta: thetaDeg, phi: 0 })
    } else {
      // Generate uniformly distributed points along the circle
      for (let j = 0; j < pointsForCircle; j += 1) {
        const phi = (2 * Math.PI * j) / pointsForCircle
        const phiDeg = (phi * 180) / Math.PI
        const x = circleRadius * Math.cos(phi)
        const z = circleRadius * Math.sin(phi)
        points.push({ x, y, z, theta: thetaDeg, phi: phiDeg })
      }
    }
  }
  return points
}
