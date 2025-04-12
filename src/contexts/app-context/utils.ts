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
export function generateDefaultSpherePoints(
  maxPoints: number,
  minPoints: number,
  circlesCount: number,
  sphereRadius: number
) {
  const points: TPoint[] = []

  const initalTheta = Math.PI / 2
  const deltaTheta = Math.PI / (circlesCount - 1)

  let theta = initalTheta

  for (let i = 0; i < circlesCount; i += 1) {
    const rx = sphereRadius * Math.cos(theta) // Radius of the circle at this latitude
    const ry = sphereRadius * Math.sin(theta) // Height at this latitude

    // Calculate the number of points on this circle, varying from minPoints to maxPoints
    const pointsCount = Math.round(
      minPoints + ((maxPoints - minPoints) * Math.abs(rx)) / sphereRadius
    )

    const deltaPhi = (2 * Math.PI) / pointsCount // Angle between points on the circle
    // Iterate over each point on the circle
    for (let j = 0; j <= pointsCount; j += 1) {
      const phi = j * deltaPhi // Longitude angle
      let x = rx * Math.cos(phi) // X coordinate
      let y = ry // Y coordinate (height)
      let z = rx * Math.sin(phi) // Z coordinate

      let degTheta = theta * (180 / Math.PI)
      let degPhi = phi * (180 / Math.PI)

      if (degTheta === 360) degTheta = 0 // Normalize theta to 0-360 range
      if (degPhi === 360) degPhi = 0 // Normalize phi to 0-360 range

      degTheta = Math.round(degTheta * 100) / 100
      degPhi = Math.round(degPhi * 100) / 100

      x = Math.round(x * 100) / 100
      y = Math.round(y * 100) / 100
      z = Math.round(z * 100) / 100

      // Add the point to the array
      points.push({ x, y, z, theta: degTheta, phi: degPhi })
    }

    theta += deltaTheta
  }
  return points
}

/**
 * Generates 3D points to form a sphere using vertical segments (meridians).
 * The sphere is built by stacking horizontal circles (latitude slices) between the poles,
 * each formed by evenly spaced points along its perimeter.
 *
 * @param pointCount - Number of horizontal circles (excluding the poles)
 * @param segmentCount - Number of points on each circle (i.e., per vertical segment or meridian)
 * @param sphereRadius - Radius of the sphere
 * @returns An array of 3D points representing the sphere's surface, including the poles,
 *          each point with spherical coordinates (theta, phi).
 */
export function generateVerticalSegmentsSpherePoints(
  pointCount: number,
  segmentCount: number,
  sphereRadius: number
) {
  const points: TPoint[] = [
    { x: 0, y: sphereRadius, z: 0, theta: 90, phi: 0 },
    { x: 0, y: -sphereRadius, z: 0, theta: 270, phi: 0 }
  ]

  const deltaTheta = Math.PI / (pointCount + 1)

  let theta = Math.PI / 2 + deltaTheta

  for (let i = 0; i < pointCount; i += 1) {
    theta = Math.PI / 2 + deltaTheta * (i + 1)
    const rx = sphereRadius * Math.cos(theta) // Radius of the circle at this latitude
    const ry = sphereRadius * Math.sin(theta) // Height at this latitude

    const deltaPhi = (2 * Math.PI) / segmentCount // Angle between points on the circle
    // Iterate over each point on the circle
    for (let j = 0; j <= segmentCount; j += 1) {
      const phi = j * deltaPhi // Longitude angle
      let x = rx * Math.cos(phi) // X coordinate
      let y = ry // Y coordinate (height)
      let z = rx * Math.sin(phi) // Z coordinate

      let degTheta = theta * (180 / Math.PI)
      let degPhi = phi * (180 / Math.PI)

      if (degTheta === 360) degTheta = 0 // Normalize theta to 0-360 range
      if (degPhi === 360) degPhi = 0 // Normalize phi to 0-360 range

      degTheta = Math.round(degTheta * 100) / 100
      degPhi = Math.round(degPhi * 100) / 100

      x = Math.round(x * 100) / 100
      y = Math.round(y * 100) / 100
      z = Math.round(z * 100) / 100

      // Add the point to the array
      points.push({ x, y, z, theta: degTheta, phi: degPhi })
    }
    console.log({ i, ry })
  }
  return points
}
