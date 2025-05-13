// Function to generate a color from a string (quiz ID)
export function generateColorFromString(str: string): string {
    // Simple hash function to convert string to a number
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }

    // Convert to a vibrant color
    // We'll use a set of predefined vibrant colors
    const colors = [
        "#FF5252", // Red
        "#FF4081", // Pink
        "#E040FB", // Purple
        "#7C4DFF", // Deep Purple
        "#536DFE", // Indigo
        "#448AFF", // Blue
        "#40C4FF", // Light Blue
        "#18FFFF", // Cyan
        "#64FFDA", // Teal
        "#69F0AE", // Green
        "#B2FF59", // Light Green
        "#EEFF41", // Lime
        "#FFFF00", // Yellow
        "#FFD740", // Amber
        "#FFAB40", // Orange
        "#FF6E40", // Deep Orange
    ]

    // Use the hash to select a color
    const index = Math.abs(hash) % colors.length
    return colors[index]
}
