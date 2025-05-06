# User Acceptance Testing Template

## Component: [Component Name]

**Tester:** [Your Name]  
**Date:** [Test Date]  
**Version:** [Version Being Tested]  

### Visual Design

| Criteria | Pass/Fail | Notes |
|----------|-----------|-------|
| Matches design specifications | [ ] | |
| Uses correct colors from design system | [ ] | |
| Typography follows design system | [ ] | |
| Spacing is consistent | [ ] | |
| Borders and shadows match specifications | [ ] | |
| Animations work as expected | [ ] | |

### Functionality

| Criteria | Pass/Fail | Notes |
|----------|-----------|-------|
| All interactive elements function correctly | [ ] | |
| Component handles different states properly | [ ] | |
| Functions correctly on desktop | [ ] | |
| Functions correctly on tablet | [ ] | |
| Functions correctly on mobile | [ ] | |
| Data persistence works (if applicable) | [ ] | |
| Resizing/moving works smoothly (if applicable) | [ ] | |

### Accessibility

| Criteria | Pass/Fail | Notes |
|----------|-----------|-------|
| Color contrast meets WCAG AA standards | [ ] | |
| Keyboard navigation works as expected | [ ] | |
| Focus states are visible | [ ] | |
| ARIA attributes are used correctly | [ ] | |
| Touch targets are adequately sized | [ ] | |
| Screen reader announces information correctly | [ ] | |

### Browser Compatibility

| Browser | Version | Pass/Fail | Notes |
|---------|---------|-----------|-------|
| Chrome | | [ ] | |
| Firefox | | [ ] | |
| Safari | | [ ] | |
| Edge | | [ ] | |
| Chrome Mobile | | [ ] | |
| Safari Mobile | | [ ] | |

### Performance

| Criteria | Pass/Fail | Notes |
|----------|-----------|-------|
| Component loads quickly | [ ] | |
| Animations run at 60fps | [ ] | |
| No visible lag or stuttering | [ ] | |
| Memory usage is reasonable | [ ] | |

### Overall Assessment

**Status:** [Approved / Rejected / Needs Revisions]

**Summary:**
[Provide a brief summary of your testing experience with this component]

**Major Issues:**
- [List any major issues that need addressing]

**Minor Issues:**
- [List any minor issues or suggestions for improvement]

### Screenshots

[Attach any relevant screenshots showing the component in different states/devices]

---

## Testing Notes

When completing this UAT form:

1. Mark each criterion as:
   - ✅ PASS - Works as expected
   - ❌ FAIL - Does not work as expected
   - ⚠️ PARTIAL - Works with minor issues

2. For any FAIL or PARTIAL result, add detailed notes explaining the issue

3. Use the Chrome DevTools device emulation for testing different screen sizes:
   - Mobile: 375px width
   - Tablet: 768px width
   - Desktop: 1024px width and larger

4. For accessibility testing:
   - Use the axe DevTools extension for automated checking
   - Test keyboard navigation personally
   - Check color contrast with WebAIM Contrast Checker

5. Be thorough but concise in your notes

6. Include screenshots demonstrating any issues

7. Submit this form with your PR when the component is complete