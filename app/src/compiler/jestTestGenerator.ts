import { ComponentNode } from '../types/schema';

export interface TestGenOptions {
  includeSnapshot?: boolean;
  includeAccessibility?: boolean;
  includeInteractions?: boolean;
  includePropsValidation?: boolean;
}

export const generateJestTestSpec = (rootNode: ComponentNode, options: TestGenOptions = {}): string => {
  const {
    includeSnapshot = true,
    includeAccessibility = true,
    includeInteractions = true,
    includePropsValidation = true,
  } = options;

  const extractNodes = (node: ComponentNode): ComponentNode[] => {
    let list = [node];
    if (node.children) {
      node.children.forEach(c => {
        list = list.concat(extractNodes(c));
      });
    }
    return list;
  };

  const allNodes = extractNodes(rootNode);
  const textNodes = allNodes.filter(n => n.type === 'Text' && n.props?.text);
  const buttonNodes = allNodes.filter(n => n.type === 'Button' && n.props?.label);
  const inputNodes = allNodes.filter(n => n.type === 'Input' && n.props?.placeholder);
  const accNodes = allNodes.filter(n => n.accessibility?.accessibilityLabel || n.accessibility?.accessibilityRole);
  const progressNodes = allNodes.filter(n => n.type === 'ProgressBar');

  let testCases: string[] = [];

  if (includeSnapshot) {
    testCases.push(`  it('renders correctly and matches component snapshot', () => {
    const { toJSON } = render(<ExportedUI />);
    expect(toJSON()).toMatchSnapshot();
  });`);
  }

  if (includePropsValidation && textNodes.length > 0) {
    const firstText = textNodes[0].props?.text;
    testCases.push(`  it('renders expected text content labels', () => {
    const { getByText } = render(<ExportedUI />);
    expect(getByText('${firstText}')).toBeTruthy();
  });`);
  }

  if (includeInteractions && buttonNodes.length > 0) {
    const firstBtn = buttonNodes[0].props?.label;
    testCases.push(`  it('handles button touch press events without crashing', () => {
    const { getByText } = render(<ExportedUI />);
    const buttonElement = getByText('${firstBtn}');
    expect(buttonElement).toBeTruthy();
    fireEvent.press(buttonElement);
  });`);
  }

  if (includeAccessibility && accNodes.length > 0) {
    const accLabel = accNodes[0].accessibility?.accessibilityLabel || accNodes[0].id;
    testCases.push(`  it('has accessible labels and screen reader roles', () => {
    const { getByLabelText } = render(<ExportedUI />);
    const accessibleElement = getByLabelText('${accLabel}');
    expect(accessibleElement).toBeTruthy();
  });`);
  }

  if (inputNodes.length > 0) {
    const placeholder = inputNodes[0].props?.placeholder;
    testCases.push(`  it('renders input fields with correct placeholder text', () => {
    const { getByPlaceholderText } = render(<ExportedUI />);
    const inputElement = getByPlaceholderText('${placeholder}');
    expect(inputElement).toBeTruthy();
    fireEvent.changeText(inputElement, 'Test User Input');
  });`);
  }

  if (progressNodes.length > 0) {
    const label = progressNodes[0].props?.label || 'Progress';
    testCases.push(`  it('renders progress bar indicator with correct status value', () => {
    const { getByText } = render(<ExportedUI />);
    expect(getByText('${label}')).toBeTruthy();
  });`);
  }

  return `import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ExportedUI from '../ExportedUI';

describe('ExportedUI Component Unit Test Suite', () => {
${testCases.join('\n\n')}
});
`;
};
