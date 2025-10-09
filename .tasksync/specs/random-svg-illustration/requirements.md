# Requirements Document: Random SVG Illustration

## Introduction

This feature transforms the static "Illustration Center" element in the Reino Capital profile card into a dynamic SVG element that displays randomly generated abstract shapes. The element currently exists as a simple `<div>` with a solid background color at the center of the profile card component.

The new implementation will replace this div with an SVG element that algorithmically generates unique, visually appealing abstract shapes on every page load, providing infinite variety and visual interest to the landing page experience.

The feature must maintain the existing dimensions, positioning, and styling while introducing dynamic visual content that enhances the premium feel of the Reino Capital brand.

## Requirements

### Requirement 1: SVG Element Replacement

**User Story:** As a developer, I want to replace the existing illustration div elements with SVG elements, so that I can render dynamic vector graphics instead of static backgrounds.

#### Acceptance Criteria

1. WHEN the page loads THEN the system SHALL identify all elements with the class `ilustration-center`
2. WHEN an `ilustration-center` element is found THEN the system SHALL replace the `<div>` with an `<svg>` element
3. WHEN replacing the element THEN the system SHALL preserve all existing attributes including `card-info="ilustration"` and class names
4. WHEN the SVG is created THEN the system SHALL set the viewBox to "0 0 120 120" to match the element dimensions
5. WHEN the SVG is created THEN the system SHALL set width and height attributes to "100%" for responsive scaling
6. WHEN the element has the `rotation` class THEN the system SHALL maintain this class on the SVG element
7. IF the replacement fails THEN the system SHALL log an error and leave the original div intact

### Requirement 2: Random Shape Generation

**User Story:** As a visitor, I want to see unique abstract shapes on each page visit, so that the experience feels fresh and dynamic.

#### Acceptance Criteria

1. WHEN the page loads THEN the system SHALL generate a completely random abstract shape
2. WHEN generating a shape THEN the system SHALL randomly select from multiple shape generation algorithms
3. WHEN a shape is generated THEN the system SHALL ensure the shape fits within the 120x120px bounds
4. WHEN generating shapes THEN the system SHALL support at least three distinct shape types: geometric polygons, organic blobs, and irregular abstract forms
5. WHEN the page is refreshed THEN the system SHALL generate a different shape with high probability (>99%)
6. IF the same seed is used THEN the system SHALL generate the same shape (for testing purposes)

### Requirement 3: Geometric Polygon Generation

**User Story:** As a visitor, I want to see interesting geometric shapes, so that the visual design feels modern and sophisticated.

#### Acceptance Criteria

1. WHEN the geometric algorithm is selected THEN the system SHALL generate polygons with 3 to 12 sides
2. WHEN generating a polygon THEN the system SHALL randomize the number of vertices
3. WHEN generating a polygon THEN the system SHALL randomize the rotation angle between 0 and 360 degrees
4. WHEN generating a polygon THEN the system SHALL randomize the scale between 0.6 and 1.0 of the available space
5. WHEN generating a polygon THEN the system SHALL optionally apply irregular vertex positioning for asymmetry
6. WHEN rendering the polygon THEN the system SHALL use the brand gold color (#daa521) with opacity between 0.3 and 0.8

### Requirement 4: Organic Blob Generation

**User Story:** As a visitor, I want to see fluid, organic shapes, so that the design feels natural and approachable.

#### Acceptance Criteria

1. WHEN the organic blob algorithm is selected THEN the system SHALL generate smooth, curved shapes using Bézier curves
2. WHEN generating a blob THEN the system SHALL create 4 to 8 control points
3. WHEN generating a blob THEN the system SHALL randomize the distance of each control point from the center
4. WHEN generating a blob THEN the system SHALL ensure smooth transitions between control points
5. WHEN generating a blob THEN the system SHALL randomize the overall rotation
6. WHEN rendering the blob THEN the system SHALL use the brand gold color (#daa521) with opacity between 0.3 and 0.8

### Requirement 5: Irregular Abstract Form Generation

**User Story:** As a visitor, I want to see unique abstract compositions, so that each visit feels special and memorable.

#### Acceptance Criteria

1. WHEN the irregular abstract algorithm is selected THEN the system SHALL generate complex multi-element compositions
2. WHEN generating an abstract form THEN the system SHALL combine 2 to 5 primitive shapes
3. WHEN generating an abstract form THEN the system SHALL randomize the position, scale, and rotation of each primitive
4. WHEN generating an abstract form THEN the system SHALL support circles, rectangles, and triangles as primitives
5. WHEN generating an abstract form THEN the system SHALL apply random opacity values to create depth
6. WHEN rendering the abstract form THEN the system SHALL use variations of the brand gold color (#daa521)

### Requirement 6: Visual Quality and Styling

**User Story:** As a brand manager, I want the generated shapes to maintain the Reino Capital visual identity, so that the design remains cohesive and professional.

#### Acceptance Criteria

1. WHEN rendering any shape THEN the system SHALL use the brand gold color (#daa521) as the primary color
2. WHEN rendering shapes THEN the system SHALL apply opacity values between 0.3 and 0.8 for visual subtlety
3. WHEN the element has the `rotation` class THEN the system SHALL ensure shapes work well with circular clipping (border-radius: 999px)
4. WHEN the element does not have the `rotation` class THEN the system SHALL ensure shapes work well with rounded corners (border-radius: 13px)
5. WHEN rendering shapes THEN the system SHALL ensure adequate contrast against the dark brown background (#382c10)
6. WHEN generating shapes THEN the system SHALL avoid shapes that are too small or too large relative to the container
7. IF a shape extends beyond bounds THEN the system SHALL clip it appropriately

### Requirement 7: Performance and Initialization

**User Story:** As a visitor, I want the page to load quickly, so that I don't experience delays or visual glitches.

#### Acceptance Criteria

1. WHEN the page loads THEN the system SHALL initialize the SVG replacement within 100ms
2. WHEN generating shapes THEN the system SHALL complete generation within 50ms
3. WHEN the Webflow runtime initializes THEN the system SHALL integrate with the existing initialization pattern
4. WHEN the SVG is rendered THEN the system SHALL not cause layout shifts or reflows
5. IF the illustration elements are not found THEN the system SHALL fail gracefully without errors
6. WHEN the system initializes THEN the system SHALL log initialization status in debug mode

### Requirement 8: Browser Compatibility

**User Story:** As a visitor using any modern browser, I want the shapes to display correctly, so that I have a consistent experience.

#### Acceptance Criteria

1. WHEN the page loads in Chrome, Firefox, Safari, or Edge THEN the system SHALL render shapes correctly
2. WHEN the page loads on mobile devices THEN the system SHALL render shapes at the correct scale
3. WHEN the page loads THEN the system SHALL use only standard SVG features supported by all modern browsers
4. IF SVG is not supported THEN the system SHALL fall back to the original div element
5. WHEN rendering shapes THEN the system SHALL not use browser-specific SVG features

### Requirement 9: Maintainability and Extensibility

**User Story:** As a developer, I want the code to be well-structured and documented, so that I can easily add new shape types or modify existing ones.

#### Acceptance Criteria

1. WHEN implementing the feature THEN the system SHALL use TypeScript with proper type definitions
2. WHEN implementing shape generators THEN the system SHALL use a modular architecture with separate functions for each shape type
3. WHEN implementing the feature THEN the system SHALL include JSDoc comments for all public functions
4. WHEN implementing the feature THEN the system SHALL follow the existing code style and patterns in the codebase
5. WHEN implementing the feature THEN the system SHALL create a new utility module in `src/utils/`
6. WHEN implementing the feature THEN the system SHALL integrate with the existing initialization pattern in `src/index.ts`

### Requirement 10: Testing and Validation

**User Story:** As a QA engineer, I want to verify that the shapes generate correctly, so that I can ensure quality before deployment.

#### Acceptance Criteria

1. WHEN testing the feature THEN the system SHALL provide a way to generate shapes with a fixed seed for reproducibility
2. WHEN testing the feature THEN the system SHALL log shape generation details in debug mode
3. WHEN testing the feature THEN the system SHALL validate that generated shapes are within bounds
4. WHEN testing the feature THEN the system SHALL validate that SVG markup is well-formed
5. IF shape generation fails THEN the system SHALL log detailed error information
6. WHEN testing THEN the system SHALL verify that both front and back card illustrations are replaced

## Edge Cases and Considerations

### Edge Cases

1. **Multiple profile cards**: The system should handle multiple profile card instances if they exist on the page
2. **Card rotation animation**: The SVG should not interfere with the existing 3D card flip animation
3. **Dynamic card creation**: If cards are created dynamically after page load, the system should handle them
4. **Missing elements**: If illustration elements are not found, the system should fail gracefully

### Technical Constraints

1. The feature must not modify the read-only source files in `webflow-source-files/`
2. The feature must work with the existing Webflow runtime and initialization pattern
3. The feature must not conflict with existing card animations and interactions
4. The feature must maintain the existing CSS styling and positioning

### Success Criteria

1. Shapes are visually appealing and align with the Reino Capital brand
2. Each page load shows a different shape
3. No performance degradation or visual glitches
4. Code is maintainable and well-documented
5. Feature integrates seamlessly with existing functionality
