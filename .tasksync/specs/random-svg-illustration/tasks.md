# Implementation Tasks: Random SVG Illustration

## Task List

- [ ] 1. Create TypeScript interfaces and types
  - Define `SVGIllustrationConfig` interface with optional properties
  - Define `ShapeGenerator` interface with name and generate function
  - Define `ShapeConfig` interface with width, height, color, opacity, random
  - Define `Point` interface with x and y coordinates
  - Define `BezierControlPoint` interface with point and control points
  - **Requirements:** Requirement 9 (Maintainability and Extensibility)
  - **Testing:** Verify types compile without errors

- [ ] 2. Implement SeededRandom class
  - Create class with private seed property
  - Implement constructor that accepts optional seed (defaults to Date.now())
  - Implement `next()` method using Linear Congruential Generator algorithm
  - Implement `nextInt(min, max)` method for integer ranges
  - Implement `nextFloat(min, max)` method for float ranges
  - Implement `choice<T>(array)` method for random array selection
  - Add JSDoc comments for all public methods
  - **Requirements:** Requirement 2 (Random Shape Generation), Requirement 10 (Testing)
  - **Testing:** Write unit tests with fixed seed to verify reproducibility

- [ ] 3. Implement SVG builder utility functions
  - Create `createSVGElement(tag, attributes)` function
  - Create `pointsToPathData(points, closed)` function to convert points to SVG path
  - Create `createPolygonPath(sides, centerX, centerY, radius, rotation, irregularity)` function
  - Create `createBezierPath(points, closed)` function for smooth curves
  - Add JSDoc comments for all functions
  - **Requirements:** Requirement 1 (SVG Element Replacement), Requirement 9 (Maintainability)
  - **Testing:** Test each utility function with sample inputs

- [ ] 4. Implement geometric polygon shape generator
  - Create `generateGeometricPolygon(config: ShapeConfig)` function
  - Randomly select number of sides between 3 and 12
  - Calculate polygon vertices using trigonometry
  - Apply random scale between 0.6 and 1.0
  - Apply random rotation between 0 and 360 degrees
  - Optionally add irregularity to vertices (0-0.3 offset)
  - Create SVG polygon element with brand color and random opacity
  - Return single `<polygon>` SVG element
  - **Requirements:** Requirement 3 (Geometric Polygon Generation)
  - **Testing:** Generate multiple polygons with fixed seed and verify variety

- [ ] 5. Implement organic blob shape generator
  - Create `generateOrganicBlob(config: ShapeConfig)` function
  - Randomly select number of control points between 4 and 8
  - Place control points around a circle with random radius variation (0.3-0.7)
  - Calculate Bézier curve control points for smooth transitions
  - Create closed path using cubic Bézier curves
  - Apply random rotation between 0 and 360 degrees
  - Create SVG path element with brand color and random opacity
  - Return single `<path>` SVG element
  - **Requirements:** Requirement 4 (Organic Blob Generation)
  - **Testing:** Generate multiple blobs with fixed seed and verify smooth curves

- [ ] 6. Implement abstract form shape generator
  - Create `generateAbstractForm(config: ShapeConfig)` function
  - Randomly select number of primitives between 2 and 5
  - For each primitive, randomly select type (circle, rectangle, triangle)
  - Apply random position within bounds
  - Apply random scale between 0.2 and 0.6
  - Apply random rotation between 0 and 360 degrees
  - Apply random opacity between 0.3 and 0.8
  - Create SVG group element containing all primitives
  - Return `<g>` SVG element with multiple shapes
  - **Requirements:** Requirement 5 (Irregular Abstract Form Generation)
  - **Testing:** Generate multiple abstract forms with fixed seed and verify composition

- [ ] 7. Implement SVGIllustrationGenerator class structure
  - Create class with private config, random, and shapeGenerators properties
  - Implement constructor that accepts optional config and merges with defaults
  - Initialize SeededRandom instance with seed from config or Date.now()
  - Initialize shapeGenerators array with all three generator functions
  - Implement private `log(...args)` method for debug logging
  - Add JSDoc comments for class and constructor
  - **Requirements:** Requirement 9 (Maintainability and Extensibility)
  - **Testing:** Instantiate class with various configs and verify initialization

- [ ] 8. Implement shape selection and generation logic
  - Create private `selectAndGenerateShape(config: ShapeConfig)` method
  - Use random.choice() to select a generator from shapeGenerators array
  - Call selected generator with ShapeConfig
  - Handle errors and fall back to simple circle if generation fails
  - Log selected generator name in debug mode
  - Return generated SVG element(s)
  - **Requirements:** Requirement 2 (Random Shape Generation), Requirement 7 (Error Handling)
  - **Testing:** Test with fixed seed to verify random selection works

- [ ] 9. Implement SVG element creation logic
  - Create private `createSVGElement(hasRotationClass: boolean)` method
  - Create SVG element with viewBox "0 0 120 120"
  - Set width and height to "100%"
  - Set preserveAspectRatio to "xMidYMid meet"
  - Create ShapeConfig with appropriate parameters
  - Call selectAndGenerateShape() to get shape element(s)
  - Append shape element(s) to SVG
  - Return complete SVG element
  - **Requirements:** Requirement 1 (SVG Element Replacement), Requirement 6 (Visual Quality)
  - **Testing:** Verify SVG structure and attributes are correct

- [ ] 10. Implement element replacement logic
  - Create private `replaceIllustrationElements()` method
  - Query all elements with selector `[card-info="ilustration"]`
  - For each element found:
    - Check if element has "rotation" class
    - Create SVG element using createSVGElement()
    - Copy all attributes from div to SVG (card-info, class)
    - Replace div with SVG in DOM
    - Log replacement in debug mode
  - Handle errors gracefully and leave original div if replacement fails
  - **Requirements:** Requirement 1 (SVG Element Replacement), Requirement 7 (Error Handling)
  - **Testing:** Test with mock DOM elements and verify replacement

- [ ] 11. Implement public init method
  - Create public `init()` method
  - Check if already initialized (prevent double initialization)
  - Call replaceIllustrationElements()
  - Log initialization complete in debug mode
  - Handle errors and log them
  - **Requirements:** Requirement 7 (Performance and Initialization)
  - **Testing:** Test initialization flow and verify elements are replaced

- [ ] 12. Implement initSVGIllustration convenience function
  - Create exported `initSVGIllustration(config?: SVGIllustrationConfig)` function
  - Instantiate SVGIllustrationGenerator with config
  - Call init() method
  - Return generator instance for testing purposes
  - Add JSDoc comments
  - **Requirements:** Requirement 9 (Maintainability and Extensibility)
  - **Testing:** Test function creates and initializes generator correctly

- [ ] 13. Integrate with src/index.ts
  - Import `initSVGIllustration` from `$utils/svg-illustration-generator`
  - Add initialization call inside Webflow.push() callback
  - Place after existing initializations
  - Pass config with `debug: true` for development
  - **Requirements:** Requirement 7 (Performance and Initialization), Requirement 9 (Integration)
  - **Testing:** Verify initialization happens on page load

- [ ] 14. Add default configuration constants
  - Define DEFAULT_CONFIG object with all default values
  - illustrationSelector: `[card-info="ilustration"]`
  - viewBox: `{ width: 120, height: 120 }`
  - brandColor: `#daa521`
  - opacityRange: `{ min: 0.3, max: 0.8 }`
  - debug: `false`
  - **Requirements:** Requirement 6 (Visual Quality and Styling)
  - **Testing:** Verify defaults are used when config is not provided

- [ ] 15. Implement error handling for shape generation
  - Wrap shape generation in try-catch blocks
  - Log errors with generator name and details
  - Fall back to simple circle shape on error
  - Ensure errors don't break page functionality
  - **Requirements:** Requirement 7 (Error Handling)
  - **Testing:** Test with intentionally broken generator and verify fallback

- [ ] 16. Add opacity randomization
  - In each shape generator, calculate random opacity
  - Use config.random.nextFloat(opacityRange.min, opacityRange.max)
  - Apply opacity to SVG elements using fill-opacity or opacity attribute
  - **Requirements:** Requirement 6 (Visual Quality and Styling)
  - **Testing:** Generate multiple shapes and verify opacity varies

- [ ] 17. Ensure shapes respect border-radius clipping
  - Verify SVG elements inherit container's border-radius
  - Test with both 13px (front) and 999px (back) border-radius
  - Ensure shapes don't overflow visible area
  - **Requirements:** Requirement 6 (Visual Quality and Styling)
  - **Testing:** Visual inspection in browser with both card faces

- [ ] 18. Add performance timing in debug mode
  - Add performance.now() timing around shape generation
  - Log generation time in debug mode
  - Verify generation completes within 50ms target
  - **Requirements:** Requirement 7 (Performance and Initialization)
  - **Testing:** Run with debug mode and check console logs

- [ ] 19. Test with multiple illustration elements
  - Verify code handles both front and back card illustrations
  - Test with multiple profile cards if they exist
  - Ensure each element gets a unique random shape
  - **Requirements:** Requirement 1 (SVG Element Replacement), Requirement 2 (Random Shape Generation)
  - **Testing:** Test with mock DOM containing multiple elements

- [ ] 20. Write comprehensive unit tests
  - Test SeededRandom class with fixed seeds
  - Test SVG builder utilities with sample inputs
  - Test each shape generator with fixed seeds
  - Test SVGIllustrationGenerator class initialization
  - Test element replacement logic with mock DOM
  - Verify all shapes are within bounds
  - Verify SVG markup is well-formed
  - **Requirements:** Requirement 10 (Testing and Validation)
  - **Testing:** Run test suite and ensure all tests pass

- [ ] 21. Perform manual browser testing
  - Test in Chrome, Firefox, Safari, and Edge
  - Test on mobile devices (iOS Safari, Chrome Mobile)
  - Verify shapes display correctly on all browsers
  - Verify shapes are different on each page refresh
  - Verify card animations still work correctly
  - Verify no console errors appear
  - Check performance (page load time, responsiveness)
  - **Requirements:** Requirement 8 (Browser Compatibility), Requirement 7 (Performance)
  - **Testing:** Manual testing checklist completion

- [ ] 22. Verify integration with existing features
  - Test that card rotation animation still works
  - Test that card click interactions still work
  - Test that Typebot integration still works
  - Test that card info updates still work
  - Verify no conflicts with existing CSS or JavaScript
  - **Requirements:** Requirement 9 (Maintainability and Extensibility)
  - **Testing:** Full regression testing of landing page features

- [ ] 23. Add final documentation and comments
  - Add comprehensive JSDoc comments to all public APIs
  - Add inline comments for complex algorithms
  - Update README if necessary
  - Document configuration options
  - Add usage examples in comments
  - **Requirements:** Requirement 9 (Maintainability and Extensibility)
  - **Testing:** Review documentation for completeness

- [ ] 24. Build and deploy to test environment
  - Run `pnpm build` to create production bundle
  - Verify no build errors or warnings
  - Test built version in browser
  - Verify shapes still generate correctly
  - Check bundle size impact
  - **Requirements:** Requirement 7 (Performance and Initialization)
  - **Testing:** Test production build functionality

- [ ] 25. Final validation and cleanup
  - Review all code for consistency with existing patterns
  - Run `pnpm lint` and fix any issues
  - Run `pnpm format` to ensure consistent formatting
  - Remove any debug code or console.logs (except debug mode)
  - Verify all requirements are met
  - Verify all acceptance criteria are satisfied
  - **Requirements:** All requirements
  - **Testing:** Final comprehensive review

## Implementation Notes

### Order of Implementation
Tasks should be completed in the order listed, as later tasks depend on earlier ones:
1. Tasks 1-3: Foundation (types, random generator, utilities)
2. Tasks 4-6: Shape generators
3. Tasks 7-12: Main class and initialization
4. Tasks 13-19: Integration and refinement
5. Tasks 20-25: Testing, validation, and deployment

### Testing Strategy
- Write unit tests alongside implementation (TDD approach)
- Test each component in isolation before integration
- Use fixed seeds for reproducible testing
- Perform manual browser testing after implementation
- Full regression testing before deployment

### Code Quality Standards
- Follow existing TypeScript patterns in codebase
- Use JSDoc comments for all public APIs
- Maintain consistent code style with existing utils
- Keep functions focused and single-purpose
- Handle errors gracefully without breaking page

### Performance Targets
- Initialization: < 100ms total
- Shape generation: < 50ms per shape
- DOM replacement: < 10ms per element
- No layout shifts or visual glitches

### Success Criteria
- All 10 requirements are fully implemented
- All acceptance criteria are met
- All tests pass
- No console errors in production
- Shapes are visually appealing and varied
- Performance targets are met
- Code is maintainable and well-documented

