/**
 * Markdown Style Configuration
 * Centralized configuration for Markdown rendering styles
 * 
 * @module data/markdown-style.config
 * 
 * @remarks
 * Changes require dev server restart to take effect
 * All styles support responsive breakpoints: mobile (<768px), tablet (768-1023px), desktop (≥1024px)
 */

/**
 * Markdown style configuration interface
 * Comprehensive type definitions for all Markdown element styles
 */
export interface MarkdownStyleConfig {
  /**
   * Post header styles (article title and description at top of page)
   */
  postHeader: {
    // Title styles
    fontSize: string;           // Mobile font size (< 768px)
    fontSizeMd: string;         // Tablet font size (768px - 1023px)
    fontSizeLg: string;         // Desktop font size (≥ 1024px)
    fontWeight: string;         // Font weight: 400-900
    color: string;              // Text color
    marginBottom: string;       // Bottom margin
    lineHeight: string;         // Line height: 1.0-2.0
    // Description styles
    descriptionFontSize: string;      // Description font size
    descriptionColor: string;         // Description color
    descriptionFontStyle: string;     // Description font style: normal, italic
    descriptionMarginBottom: string;  // Description bottom margin
    descriptionBorderColor: string;   // Description left border color
    descriptionBorderWidth: string;   // Description left border width
    descriptionPaddingLeft: string;   // Description left padding
  };

  /**
   * Base typography settings
  /**
   * Base typography settings
   */
  typography: {
    fontSize: string;           // Mobile font size (< 768px): e.g., '15px', '1rem'
    fontSizeMd: string;         // Tablet font size (768px - 1023px): e.g., '16px', '1.05rem'
    fontSizeLg: string;         // Desktop font size (≥ 1024px): e.g., '17px', '1.1rem'
    lineHeight: string;         // Line height: e.g., '1.7', '1.5'
    letterSpacing: string;      // Letter spacing: e.g., '0.01em', 'normal'
    fontFamily: string;         // Font family: e.g., '-apple-system, sans-serif'
    color: string;              // Text color: CSS color value or variable
    maxWidth: string;           // Max width: e.g., '100%', '65ch'
    textRendering: string;      // Text rendering optimization: 'optimizeLegibility', etc.
    fontSmoothing: string;      // Font smoothing: 'antialiased', etc.
    wordSpacing: string;        // Word spacing: e.g., 'normal', '0.05em'
  };

  /**
   * Heading styles (H1-H6)
   */
  headings: {
    h1: {
      fontSize: string;               // Mobile font size (< 768px): e.g. '2.0em', '32px'
      fontSizeMd: string;             // Tablet font size (768-1023px): e.g. '2.25em', '36px'
      fontSizeLg: string;             // Desktop font size (≥1024px): e.g. '2.5em', '40px'
      fontWeight: string;             // Font weight: 400-900
      color: string;                  // Text color: CSS color value or variable
      marginTop: string;              // Top margin: e.g. '2.0em', '1rem'
      marginBottom: string;           // Bottom margin: e.g. '1.0em', '1rem'
      paddingBottom: string;          // Bottom padding: e.g. '0.4em', '0'
      lineHeight: string;             // Line height: e.g. '1.2', '1.5'
      textAlign: string;              // Alignment: 'left', 'center', 'right'
      borderBottom: string;           // Bottom border: e.g. '2px solid var(...)', 'none'
      showDecorator: boolean;         // Show decorator: true/false
      decoratorGradient: string;      // Decorator gradient: e.g. 'linear-gradient(...)'
      decoratorWidth: string;         // Decorator width: e.g. '60px', '50px'
      decoratorHeight: string;        // Decorator height: e.g. '4px', '3px'
      textShadow: string;             // Text shadow: e.g. '2px 2px 4px rgba(...)', 'none'
    };
    h2: {
      fontSize: string;               // Mobile font size (< 768px): e.g. '1.75em', '28px'
      fontSizeMd: string;             // Tablet font size (768-1023px): e.g. '1.875em', '30px'
      fontSizeLg: string;             // Desktop font size (≥1024px): e.g. '2.0em', '32px'
      fontWeight: string;             // Font weight: 400-900
      color: string;                  // Text color: CSS color value or variable
      marginTop: string;              // Top margin: e.g. '1.8em', '1rem'
      marginBottom: string;           // Bottom margin: e.g. '0.9em', '1rem'
      paddingBottom: string;          // Bottom padding: e.g. '0.4em', '0'
      lineHeight: string;             // Line height: e.g. '1.3', '1.5'
      textAlign: string;              // Alignment: 'left', 'center', 'right'
      borderBottom: string;           // Bottom border: e.g. '2px solid var(...)', 'none'
      showDecorator: boolean;         // Show decorator: true/false
      decoratorGradient: string;      // Decorator gradient: e.g. 'linear-gradient(...)'
      decoratorWidth: string;         // Decorator width: e.g. '60px', '50px'
      decoratorHeight: string;        // Decorator height: e.g. '4px', '3px'
      textShadow: string;             // Text shadow: e.g. '2px 2px 4px rgba(...)', 'none'
    };
    h3: {
      fontSize: string;               // Mobile font size (< 768px): e.g. '1.4em', '22px'
      fontSizeMd: string;             // Tablet font size (768-1023px): e.g. '1.5em', '24px'
      fontSizeLg: string;             // Desktop font size (≥1024px): e.g. '1.625em', '26px'
      fontWeight: string;             // Font weight: 400-900
      color: string;                  // Text color: CSS color value or variable
      marginTop: string;              // Top margin: e.g. '1.6em', '1rem'
      marginBottom: string;           // Bottom margin: e.g. '0.7em', '1rem'
      paddingBottom: string;          // Bottom padding: e.g. '0.3em', '0'
      lineHeight: string;             // Line height: e.g. '1.4', '1.5'
      textAlign: string;              // Alignment: 'left', 'center', 'right'
      borderBottom: string;           // Bottom border: e.g. '1px solid var(...)', 'none'
      showDecorator: boolean;         // Show decorator: true/false
      decoratorGradient: string;      // Decorator gradient: e.g. 'linear-gradient(...)'
      decoratorWidth: string;         // Decorator width: e.g. '50px', '40px'
      decoratorHeight: string;        // Decorator height: e.g. '3px', '2px'
      textShadow: string;             // Text shadow: e.g. '2px 2px 4px rgba(...)', 'none'
    };
    h4: {
      fontSize: string;               // Mobile font size (< 768px): e.g. '1.2em', '19px'
      fontSizeMd: string;             // Tablet font size (768-1023px): e.g. '1.25em', '20px'
      fontSizeLg: string;             // Desktop font size (≥1024px): e.g. '1.375em', '22px'
      fontWeight: string;             // Font weight: 400-900
      color: string;                  // Text color: CSS color value or variable
      marginTop: string;              // Top margin: e.g. '1.4em', '1rem'
      marginBottom: string;           // Bottom margin: e.g. '0.5em', '0.5rem'
      paddingBottom: string;          // Bottom padding: e.g. '0.2em', '0'
      lineHeight: string;             // Line height: e.g. '1.4', '1.5'
      textAlign: string;              // Alignment: 'left', 'center', 'right'
      borderBottom: string;           // Bottom border: e.g. '1px solid var(...)', 'none'
      showDecorator: boolean;         // Show decorator: true/false
      decoratorGradient: string;      // Decorator gradient: e.g. 'linear-gradient(...)'
      decoratorWidth: string;         // Decorator width: e.g. '40px', '30px'
      decoratorHeight: string;        // Decorator height: e.g. '3px', '2px'
      textShadow: string;             // Text shadow: e.g. '2px 2px 4px rgba(...)', 'none'
    };
    h5: {
      fontSize: string;               // Mobile font size (< 768px): e.g. '1.1em', '17px'
      fontSizeMd: string;             // Tablet font size (768-1023px): e.g. '1.125em', '18px'
      fontSizeLg: string;             // Desktop font size (≥1024px): e.g. '1.2em', '19px'
      fontWeight: string;             // Font weight: 400-900
      color: string;                  // Text color: CSS color value or variable
      marginTop: string;              // Top margin: e.g. '1.2em', '1rem'
      marginBottom: string;           // Bottom margin: e.g. '0.5em', '0.5rem'
      paddingBottom: string;          // Bottom padding: e.g. '0', '0'
      lineHeight: string;             // Line height: e.g. '1.5', '1.5'
      textAlign: string;              // Alignment: 'left', 'center', 'right'
      borderBottom: string;           // Bottom border: e.g. 'none', 'none'
      showDecorator: boolean;         // Show decorator: true/false
      decoratorGradient: string;      // Decorator gradient: e.g. 'linear-gradient(...)'
      decoratorWidth: string;         // Decorator width: e.g. '30px', '25px'
      decoratorHeight: string;        // Decorator height: e.g. '2px', '2px'
      textShadow: string;             // Text shadow: e.g. 'none', 'none'
    };
    h6: {
      fontSize: string;               // Mobile font size (< 768px): e.g. '1.0em', '16px'
      fontSizeMd: string;             // Tablet font size (768-1023px): e.g. '1.05em', '17px'
      fontSizeLg: string;             // Desktop font size (≥1024px): e.g. '1.1em', '18px'
      fontWeight: string;             // Font weight: 400-900
      color: string;                  // Text color: CSS color value or variable
      marginTop: string;              // Top margin: e.g. '1.0em', '1rem'
      marginBottom: string;           // Bottom margin: e.g. '0.5em', '0.5rem'
      paddingBottom: string;          // Bottom padding: e.g. '0', '0'
      lineHeight: string;             // Line height: e.g. '1.5', '1.5'
      textAlign: string;              // Alignment: 'left', 'center', 'right'
      borderBottom: string;           // Bottom border: e.g. 'none', 'none'
      showDecorator: boolean;         // Show decorator: true/false
      decoratorGradient: string;      // Decorator gradient: e.g. 'linear-gradient(...)'
      decoratorWidth: string;         // Decorator width: e.g. '25px', '20px'
      decoratorHeight: string;        // Decorator height: e.g. '2px', '2px'
      textShadow: string;             // Text shadow: e.g. 'none', 'none'
    };
  };

  /**
   * Paragraph styles
   */
  paragraph: {
    marginTop: string;          // Top margin: e.g. '0', '1em'
    marginBottom: string;       // Bottom margin: e.g. '1.1em', '1rem'
    textAlign: string;          // Alignment: 'left', 'center', 'right', 'justify'
    textIndent: string;         // Text indent: e.g. '0', '2em'
    orphans: number;            // Orphans: minimum lines, e.g. 3
    widows: number;             // Widows: minimum lines, e.g. 3
  };

  /**
   * Link styles
   */
  link: {
    color: string;              // Link color: CSS color value or variable
    hoverColor: string;         // Hover color: CSS color value or variable
    underline: boolean;         // Show underline: true/false
    underlineStyle: string;     // Underline style: 'solid', 'gradient', 'animated'
    underlineThickness: string; // Underline thickness: e.g. '2px', '1px'
    underlineOffset: string;    // Underline offset: e.g. '3px', '2px'
    fontWeight: string;         // Link font weight: 400-900
    transition: string;         // Transition: e.g. 'all 0.3s ease'
    externalIcon: boolean;      // Show external icon: true/false
    externalIconSymbol: string; // External icon symbol: e.g. '🔗', '↗'
  };

  /**
   * Code styles (inline and block)
   */
  code: {
    // Inline code
    inline: {
      fontSize: string;         // Mobile font size (< 768px): e.g. '0.875em', '14px'
      fontSizeMd: string;       // Tablet font size (768-1023px): e.g. '0.9em', '14.5px'
      fontSizeLg: string;       // Desktop font size (≥1024px): e.g. '0.925em', '15px'
      fontFamily: string;       // Font family: e.g. '"JetBrains Mono", monospace'
      backgroundColor: string;  // Background color: CSS color value or variable
      color: string;            // Text color: CSS color value or variable
      padding: string;          // Padding: e.g. '0.15em 0.35em'
      borderRadius: string;     // Border radius: e.g. '3px', '4px'
      border: string;           // Border: e.g. '1px solid var(...)', 'none'
    };
    // Code block
    block: {
      fontSize: string;         // Mobile font size (< 768px): e.g. '0.85em', '14px'
      fontSizeMd: string;       // Tablet font size (768-1023px): e.g. '0.875em', '14.5px'
      fontSizeLg: string;       // Desktop font size (≥1024px): e.g. '0.9em', '15px'
      fontFamily: string;       // Font family: e.g. '"JetBrains Mono", monospace'
      backgroundColor: string;  // Background color: CSS color value or variable
      padding: string;          // Padding: e.g. '1.2em'
      borderRadius: string;     // Border radius: e.g. '10px', '8px'
      border: string;           // Border: e.g. '1px solid var(...)', 'none'
      marginTop: string;        // Top margin: e.g. '1.3em', '1rem'
      marginBottom: string;     // Bottom margin: e.g. '1.3em', '1rem'
      maxHeight: string;        // Maximum height: e.g. '600px', 'none'
      overflow: string;         // Overflow: 'auto', 'scroll', 'hidden'
      showLineNumbers: boolean; // Show line numbers: true/false
      lineNumberStyle: string;  // Line number style: 'normal', 'minimal', 'fancy'
      lineNumberColor: string;  // Line number color: CSS color value or variable
      lineNumberBg: string;     // Line number background color: CSS color value or variable
      showLanguage: boolean;    // Show language tag: true/false
      languagePosition: string; // Language tag position: 'top-right', 'top-left'
      languageStyle: string;    // Language tag style: CSS style string
      showCopyButton: boolean;  // Show copy button: true/false
      copyButtonPosition: string; // Copy button position: 'top-right', 'top-left'
      copyButtonStyle: string;  // Copy button style: CSS style string
      copyButtonText: string;   // Copy button text: e.g. 'Copy', '复制'
      copiedButtonText: string; // Copied text: e.g. 'Copied!', '已复制！'
      scrollbarWidth: string;   // Scrollbar width: e.g. '8px', '10px'
      scrollbarColor: string;   // Scrollbar color: CSS color value or variable
      lineHeight: string;       // Code line height: e.g. '1.6', '1.5'
      boxShadow: string;        // Shadow: e.g. '0 2px 8px rgba(0,0,0,0.08)', 'none'
      tabSize: number;          // Tab size: e.g. 2, 4
      highlightLines: boolean;  // Highlight lines: true/false
      highlightColor: string;   // Highlight line color: CSS color value or variable
    };
  };

  /**
   * Blockquote styles
   */
  blockquote: {
    fontSize: string;           // Mobile font size (< 768px): e.g. '0.93em', '15px'
    fontSizeMd: string;         // Tablet font size (768-1023px): e.g. '0.95em', '15.5px'
    fontSizeLg: string;         // Desktop font size (≥1024px): e.g. '1.0em', '16px'
    fontStyle: string;          // Font style: 'normal', 'italic'
    color: string;              // Text color: CSS color value or variable
    backgroundColor: string;    // Background color: CSS color value or variable
    borderLeft: string;         // Left border: e.g. '3px solid var(...)'
    padding: string;            // Padding: e.g. '0.9em 1.3em'
    marginTop: string;          // Top margin: e.g. '1.3em', '1rem'
    marginBottom: string;       // Bottom margin: e.g. '1.3em', '1rem'
    borderRadius: string;       // Border radius: e.g. '0 6px 6px 0', '4px'
    showQuoteMark: boolean;     // Show quote mark: true/false
    quoteMarkSize: string;      // Quote mark size: e.g. '2.5em', '3em'
    quoteMarkColor: string;     // 引号Color: CSS color value or variable
    boxShadow: string;          // Shadow: e.g. '0 2px 6px rgba(0,0,0,0.05)', 'none'
    fontWeight: string;         // Font weight: 400-900
  };

  /**
   * List styles (unordered, ordered, and task lists)
   */
  list: {
    // Unordered list
    ul: {
      marginTop: string;        // Top margin: e.g. '0.9em', '1rem'
      marginBottom: string;     // Bottom margin: e.g. '0.9em', '1rem'
      paddingLeft: string;      // Left padding: e.g. '1.3em', '2rem'
      markerColor: string;      // Marker color: CSS color value or variable
      markerType: string;       // Marker type: 'disc', 'circle', 'square'
      nestedIndent: string;     // Nested indent: e.g. '1.3em', '2em'
    };
    // Ordered list
    ol: {
      marginTop: string;        // Top margin: e.g. '0.9em', '1rem'
      marginBottom: string;     // Bottom margin: e.g. '0.9em', '1rem'
      paddingLeft: string;      // Left padding: e.g. '1.3em', '2rem'
      markerColor: string;      // Marker color: CSS color value or variable
      markerFontWeight: string; // Marker font weight: 400-900
      nestedIndent: string;     // Nested indent: e.g. '1.3em', '2em'
    };
    // List item
    li: {
      marginBottom: string;     // Bottom margin: e.g. '0.4em', '0.5rem'
      lineHeight: string;       // Line height: e.g. '1.6', '1.5'
    };
    // Task list
    task: {
      checkboxSize: string;     // Checkbox size: e.g. '1.1em', '16px'
      checkboxColor: string;    // Checkbox color: CSS color value or variable
      checkedColor: string;     // Checked color: CSS color value or variable
    };
  };

  /**
   * Table styles
   */
  table: {
    width: string;              // Width: e.g. '100%', 'auto'
    marginTop: string;          // Top margin: e.g. '1.3em', '1rem'
    marginBottom: string;       // Bottom margin: e.g. '1.3em', '1rem'
    fontSize: string;           // Font size: e.g. '0.88em', '14px'
    borderCollapse: string;     // Border collapse: 'separate', 'collapse'
    border: string;             // Border: e.g. '1px solid var(...)'
    borderRadius: string;       // Border radius: e.g. '6px', '8px'
    overflow: string;           // Overflow: 'hidden', 'auto'
    // Table header
    th: {
      backgroundColor: string;  // Background color: CSS color value or variable
      color: string;            // Text color: CSS color value or variable
      fontWeight: string;       // Font weight: 400-900
      padding: string;          // Padding: e.g. '0.65em 0.9em'
      borderBottom: string;     // Bottom border: e.g. '2px solid var(...)'
      textAlign: string;        // Alignment: 'left', 'center', 'right'
    };
    // Table cell
    td: {
      padding: string;          // Padding: e.g. '0.65em 0.9em'
      borderBottom: string;     // Bottom border: e.g. '1px solid var(...)'
    };
    striped: boolean;           // Striped rows: true/false
    stripedColor: string;       // Color: CSS color value or variable
    hoverColor: string;         // Hover color: CSS color value or variable
  };

  /**
   * Image styles
   */
  image: {
    maxWidth: string;           // maxWidth: e.g. '100%', '800px'
    marginTop: string;          // Top margin: e.g. '1.3em', '1rem'
    marginBottom: string;       // Bottom margin: e.g. '1.3em', '1rem'
    borderRadius: string;       // Border radius: e.g. '6px', '8px'
    border: string;             // Border: e.g. '1px solid var(...)', 'none'
    boxShadow: string;          // Shadow: e.g. '0 3px 10px rgba(0,0,0,0.1)', 'none'
    hoverTransform: string;     // Hover transform: e.g. 'scale(1.02)', 'none'
    hoverShadow: string;        // Hover shadow: e.g. '0 6px 20px rgba(0,0,0,0.15)', 'none'
    transition: string;         // Transition: e.g. 'all 0.3s ease'
    cursor: string;             // Cursor: 'pointer', 'default', 'zoom-in'
    display: string;            // Display: 'block', 'inline-block'
  };

  /**
   * Horizontal rule (hr) styles
   */
  hr: {
    marginTop: string;          // Top margin: e.g. '1.8em', '2rem'
    marginBottom: string;       // Bottom margin: e.g. '1.8em', '2rem'
    border: string;             // Border: e.g. '1px solid var(...)', 'none'
    height: string;             // Height: e.g. '1px', '2px'
    background: string;         // Background: e.g. 'linear-gradient(...)', CSS color value
    showDecorator: boolean;     // Show decorator: true/false
    decoratorSymbol: string;    // Decorator symbol: e.g. '◆', '❖', '✦'
    decoratorColor: string;     // Decorator symbol color: CSS color value or variable
  };

  /**
   * Other element styles (mark, kbd, abbr, details, strong, em, del, sup, sub)
   */
  others: {
    // Highlight mark
    mark: {
      backgroundColor: string;  // Background color: CSS color value or variable
      color: string;            // Text color: CSS color value or variable
      padding: string;          // Padding: e.g. '0.05em 0.25em'
      borderRadius: string;     // Border radius: e.g. '2px', '3px'
    };
    // Keyboard key
    kbd: {
      backgroundColor: string;  // Background color: CSS color value or variable
      color: string;            // Text color: CSS color value or variable
      padding: string;          // Padding: e.g. '0.15em 0.4em'
      borderRadius: string;     // Border radius: e.g. '3px', '4px'
      border: string;           // Border: e.g. '1px solid var(...)'
      boxShadow: string;        // Shadow: e.g. '0 1px 0 var(...)', 'none'
      fontSize: string;         // Font size: e.g. '0.875em', '14px'
      fontFamily: string;       // Font family: e.g. '"JetBrains Mono", monospace'
      fontWeight: string;       // Font weight: 400-900
    };
    // Abbreviation
    abbr: {
      textDecoration: string;   // Text decoration: e.g. 'underline dotted'
      cursor: string;           // Cursor: 'help', 'pointer'
      borderBottom: string;     // Bottom border: e.g. '1px dotted var(...)', 'none'
    };
    // Collapsible details
    details: {
      marginTop: string;        // Top margin: e.g. '0.9em', '1rem'
      marginBottom: string;     // Bottom margin: e.g. '0.9em', '1rem'
      padding: string;          // Padding: e.g. '0.9em', '1rem'
      backgroundColor: string;  // Background color: CSS color value or variable
      borderRadius: string;     // Border radius: e.g. '6px', '8px'
      border: string;           // Border: e.g. '1px solid var(...)'
      boxShadow: string;        // Shadow: e.g. '0 1px 3px rgba(0,0,0,0.05)', 'none'
    };
    // Bold text
    strong: {
      fontWeight: string;       // Font weight: 700-900
      color: string;            // Text color: CSS color value or variable
    };
    // Italic text
    em: {
      fontStyle: string;        // Font style: 'italic', 'normal'
      color: string;            // Text color: CSS color value or variable
    };
    // Strikethrough text
    del: {
      textDecorationColor: string; // Strikethrough color: CSS color value or variable
      opacity: string;          // Opacity: e.g. '0.7', '0.5'
    };
    // Superscript
    sup: {
      fontSize: string;         // Font size: e.g. '0.75em', '12px'
      verticalAlign: string;    // Vertical alignment: 'super', 'top'
    };
    // Subscript
    sub: {
      fontSize: string;         // Font size: e.g. '0.75em', '12px'
      verticalAlign: string;    // Vertical alignment: 'sub', 'bottom'
    };
  };
}

// Default Markdown style configuration
export const defaultMarkdownStyle: MarkdownStyleConfig = {
  postHeader: {
    // Title styles
    fontSize: '1.5em',                                      // Mobile
    fontSizeMd: '1.75em',                                   // Tablet
    fontSizeLg: '2.0em',                                    // Desktop
    fontWeight: '700',                                      // Bold
    color: 'var(--md-sys-color-on-surface)',                // Primary text color
    marginBottom: '1.5rem',                                 // Title bottom margin
    lineHeight: '1.2',                                      // Tight line height
    // Description styles
    descriptionFontSize: '1.000rem',                        // Description font size
    descriptionColor: 'var(--md-sys-color-on-surface-variant)', // Secondary text color
    descriptionFontStyle: 'italic',                         // Italic
    descriptionMarginBottom: '1.5rem',                      // Description bottom margin
    descriptionBorderColor: 'var(--md-sys-color-primary)',  // Left border color
    descriptionBorderWidth: '4px',                          // Left border width
    descriptionPaddingLeft: '1rem',                         // Left padding
  },

  typography: {
    fontSize: '13px',        
    fontSizeMd: '14px',
    fontSizeLg: '15px',
    lineHeight: '1.55',
    letterSpacing: '0.003em',
    fontFamily: 'var(--reay-font-prose)',
    color: 'var(--md-sys-color-on-surface)',
    maxWidth: '100%',
    textRendering: 'optimizeLegibility',
    fontSmoothing: 'antialiased',
    wordSpacing: 'normal',
  },

  headings: {
    h1: {
      fontSize: '1.6em',        
      fontSizeMd: '1.75em',     
      fontSizeLg: '1.85em',     
      fontWeight: '700',
      color: 'var(--md-sys-color-on-surface)',
      marginTop: '1.2em',       
      marginBottom: '0.6em',    
      paddingBottom: '0',
      lineHeight: '1.2',
      textAlign: 'left',
      borderBottom: 'none',
      showDecorator: false,
      decoratorGradient: 'linear-gradient(90deg, var(--md-sys-color-primary), var(--md-sys-color-tertiary))',
      decoratorWidth: '80px',
      decoratorHeight: '5px',
      textShadow: 'none',
    },
    h2: {
      fontSize: '1.4em',        
      fontSizeMd: '1.5em',
      fontSizeLg: '1.6em',
      fontWeight: '600',
      color: 'var(--md-sys-color-on-surface)',
      marginTop: '1.3em',
      marginBottom: '0.55em',   
      paddingBottom: '0.25em',  
      lineHeight: '1.3',
      textAlign: 'left',
      borderBottom: '1px solid var(--md-sys-color-outline-variant)',
      showDecorator: false,
      decoratorGradient: 'linear-gradient(90deg, var(--md-sys-color-primary), var(--md-sys-color-tertiary))',
      decoratorWidth: '60px',
      decoratorHeight: '4px',
      textShadow: 'none',
    },
    h3: {
      fontSize: '1.2em',        
      fontSizeMd: '1.3em',
      fontSizeLg: '1.4em',
      fontWeight: '600',
      color: 'var(--md-sys-color-on-surface)',
      marginTop: '1.1em',
      marginBottom: '0.5em',    
      paddingBottom: '0',
      lineHeight: '1.4',
      textAlign: 'left',
      borderBottom: 'none',
      showDecorator: false,
      decoratorGradient: 'linear-gradient(90deg, var(--md-sys-color-primary), var(--md-sys-color-tertiary))',
      decoratorWidth: '50px',
      decoratorHeight: '3px',
      textShadow: 'none',
    },
    h4: {
      fontSize: '1.08em',
      fontSizeMd: '1.12em',
      fontSizeLg: '1.2em',
      fontWeight: '600',
      color: 'var(--md-sys-color-on-surface)',
      marginTop: '1.0em',
      marginBottom: '0.35em',
      paddingBottom: '0',
      lineHeight: '1.4',
      textAlign: 'left',
      borderBottom: 'none',
      showDecorator: false,
      decoratorGradient: 'linear-gradient(90deg, var(--md-sys-color-primary), var(--md-sys-color-tertiary))',
      decoratorWidth: '40px',
      decoratorHeight: '3px',
      textShadow: 'none',
    },
    h5: {
      fontSize: '1.05em',       
      fontSizeMd: '1.1em',      
      fontSizeLg: '1.15em',    
      fontWeight: '600',
      color: 'var(--md-sys-color-on-surface-variant)',
      marginTop: '1.0em',       
      marginBottom: '0.3em',
      paddingBottom: '0',
      lineHeight: '1.5',
      textAlign: 'left',
      borderBottom: 'none',
      showDecorator: false,
      decoratorGradient: 'linear-gradient(90deg, var(--md-sys-color-primary), var(--md-sys-color-tertiary))',
      decoratorWidth: '30px',
      decoratorHeight: '2px',
      textShadow: 'none',
    },
    h6: {
      fontSize: '0.95em',       
      fontSizeMd: '1.0em',
      fontSizeLg: '1.05em',
      fontWeight: '600',
      color: 'var(--md-sys-color-on-surface-variant)',
      marginTop: '0.9em',
      marginBottom: '0.25em',
      paddingBottom: '0',
      lineHeight: '1.5',
      textAlign: 'left',
      borderBottom: 'none',
      showDecorator: false,
      decoratorGradient: 'linear-gradient(90deg, var(--md-sys-color-primary), var(--md-sys-color-tertiary))',
      decoratorWidth: '30px',
      decoratorHeight: '2px',
      textShadow: 'none',
    },
  },

  paragraph: {
    marginTop: '0',
    marginBottom: '0.75em',     
    textAlign: 'left',
    textIndent: '0',
    orphans: 3,
    widows: 3,
  },

  link: {
    color: 'var(--md-sys-color-primary)',
    hoverColor: 'var(--md-sys-color-primary-container)',
    underline: true,
    underlineStyle: 'animated',
    underlineThickness: '1px',    
    underlineOffset: '1.5px',     
    fontWeight: '500',
    transition: 'all 0.3s ease',
    externalIcon: false,
    externalIconSymbol: '🔗',
  },

  code: {
    inline: {
      fontSize: '0.82em',          
      fontSizeMd: '0.85em', 
      fontSizeLg: '0.875em', 
      fontFamily: 'var(--reay-font-mono)',
      backgroundColor: 'var(--md-sys-color-surface-variant)',
      color: 'var(--md-sys-color-on-surface-variant)',
      padding: '0.08em 0.25em', 
      borderRadius: '3px',
      border: '1px solid var(--md-sys-color-outline-variant)',
    },
    block: {
      fontSize: '0.78em', 
      fontSizeMd: '0.82em',         
      fontSizeLg: '0.85em',
      fontFamily: 'var(--reay-font-mono)',
      backgroundColor: 'var(--md-sys-color-surface-container)',
      padding: '0.85em', 
      borderRadius: '6px',
      border: '1px solid var(--md-sys-color-outline-variant)',
      marginTop: '0.85em', 
      marginBottom: '0.85em',
      maxHeight: '600px',
      overflow: 'auto',
      showLineNumbers: true,
      lineNumberStyle: 'normal',
      lineNumberColor: 'var(--md-sys-color-on-surface-variant)',
      lineNumberBg: 'var(--md-sys-color-surface-variant)',
      showLanguage: true,
      languagePosition: 'top-right',
      languageStyle: 'padding: 0.15em 0.5em; background: var(--md-sys-color-primary); color: var(--md-sys-color-on-primary); border-radius: 0 6px 0 4px; font-size: 0.65em; font-weight: 600; text-transform: uppercase;',
      showCopyButton: true,
      copyButtonPosition: 'top-right',
      copyButtonStyle: 'padding: 0.3em 0.6em; background: var(--md-sys-color-surface-variant); color: var(--md-sys-color-on-surface-variant); border: 1px solid var(--md-sys-color-outline); border-radius: 4px; cursor: pointer; font-size: 0.7em; transition: all 0.2s ease;',
      copyButtonText: 'Copy',
      copiedButtonText: 'Copied!',
      scrollbarWidth: '8px',
      scrollbarColor: 'var(--md-sys-color-primary) var(--md-sys-color-surface-variant)',
      lineHeight: '1.45',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      tabSize: 2,
      highlightLines: true,
      highlightColor: 'rgba(var(--md-sys-color-primary-rgb, 103, 80, 164), 0.1)',
    },
  },

  blockquote: {
    fontSize: '0.78em',
    fontSizeMd: '0.82em',
    fontSizeLg: '0.88em',
    fontStyle: 'normal',
    color: 'var(--md-sys-color-on-surface-variant)',
    backgroundColor: 'var(--md-sys-color-surface-variant)',
    borderLeft: '2px solid var(--md-sys-color-primary)',
    padding: '0.6em 0.95em',
    marginTop: '0.85em', 
    marginBottom: '0.85em', 
    borderRadius: '0 4px 4px 0',
    showQuoteMark: true,
    quoteMarkSize: '2.1em', 
    quoteMarkColor: 'var(--md-sys-color-primary)',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
    fontWeight: 'normal',
  },

  list: {
    ul: {
      marginTop: '0.6em',
      marginBottom: '0.6em',
      paddingLeft: '0.95em',
      markerColor: 'var(--md-sys-color-primary)',
      markerType: 'disc',
      nestedIndent: '0.95em',
    },
    ol: {
      marginTop: '0.6em',
      marginBottom: '0.6em',
      paddingLeft: '0.95em',
      markerColor: 'var(--md-sys-color-primary)',
      markerFontWeight: '600',
      nestedIndent: '0.95em',
    },
    li: {
      marginBottom: '0.25em',
      lineHeight: '1.45',
    },
    task: {
      checkboxSize: '0.95em',
      checkboxColor: 'var(--md-sys-color-outline)',
      checkedColor: 'var(--md-sys-color-primary)',
    },
  },

  table: {
    width: '100%',
    marginTop: '0.85em',
    marginBottom: '0.85em',
    fontSize: '0.82em',
    borderCollapse: 'separate',
    border: '1px solid var(--md-sys-color-outline-variant)',
    borderRadius: '4px',
    overflow: 'hidden',
    th: {
      backgroundColor: 'var(--md-sys-color-surface-variant)',
      color: 'var(--md-sys-color-on-surface-variant)',
      fontWeight: '600',
      padding: '0.4em 0.65em',
      borderBottom: '2px solid var(--md-sys-color-outline)',
      textAlign: 'left',
    },
    td: {
      padding: '0.4em 0.65em',
      borderBottom: '1px solid var(--md-sys-color-outline-variant)',
    },
    striped: true,
    stripedColor: 'var(--md-sys-color-surface-container)',
    hoverColor: 'var(--md-sys-color-surface-variant)',
  },

  image: {
    maxWidth: '100%',
    marginTop: '0.85em',
    marginBottom: '0.85em',
    borderRadius: '4px',
    border: 'none',
    boxShadow: '0 1.5px 6px rgba(0, 0, 0, 0.1)',
    hoverTransform: 'scale(1.02)',
    hoverShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    display: 'block',
  },

  hr: {
    marginTop: '1.2em',
    marginBottom: '1.2em',
    border: 'none',
    height: '1px',
    background: 'linear-gradient(90deg, transparent, var(--md-sys-color-outline-variant), transparent)',
    showDecorator: true,
    decoratorSymbol: '◆',
    decoratorColor: 'var(--md-sys-color-primary)',
  },

  others: {
    mark: {
      backgroundColor: 'var(--md-sys-color-tertiary-container)',
      color: 'var(--md-sys-color-on-tertiary-container)',
      padding: '0.02em 0.15em',
      borderRadius: '2px',
    },
    kbd: {
      backgroundColor: 'var(--md-sys-color-surface-variant)',
      color: 'var(--md-sys-color-on-surface-variant)',
      padding: '0.08em 0.3em',
      borderRadius: '3px',
      border: '1px solid var(--md-sys-color-outline)',
      boxShadow: '0 1px 0 var(--md-sys-color-outline-variant)',
      fontSize: '0.82em',
      fontFamily: 'var(--reay-font-mono)',
      fontWeight: '500',
    },
    abbr: {
      textDecoration: 'underline dotted',
      cursor: 'help',
      borderBottom: '1px dotted var(--md-sys-color-outline)',
    },
    details: {
      marginTop: '0.6em',
      marginBottom: '0.6em',
      padding: '0.6em',
      backgroundColor: 'var(--md-sys-color-surface-variant)',
      borderRadius: '4px',
      border: '1px solid var(--md-sys-color-outline-variant)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },
    strong: {
      fontWeight: '700',
      color: 'var(--md-sys-color-on-surface)',
    },
    em: {
      fontStyle: 'italic',
      color: 'var(--md-sys-color-on-surface-variant)',
    },
    del: {
      textDecorationColor: 'var(--md-sys-color-error)',
      opacity: '0.7',
    },
    sup: {
      fontSize: '0.75em',
      verticalAlign: 'super',
    },
    sub: {
      fontSize: '0.75em',
      verticalAlign: 'sub',
    },
  },
};

/**
 * Style Presets
 * Pre-configured Markdown style variations for different use cases
 */
export const markdownStylePresets = {
  /**
   * Default style preset
   * Balanced and optimized for general content readability
   */
  default: defaultMarkdownStyle,

  /**
   * Compact style preset
   * Tighter spacing and smaller fonts for dense content
   */
  compact: {
    ...defaultMarkdownStyle,
    typography: {
      ...defaultMarkdownStyle.typography,
      fontSize: '16px',
      lineHeight: '1.6',
    },
    headings: {
      ...defaultMarkdownStyle.headings,
      h2: {
        ...defaultMarkdownStyle.headings.h2,
        marginTop: '1.5em',
        marginBottom: '0.75em',
      },
    },
    paragraph: {
      marginBottom: '1em',
      textAlign: 'left',
    },
  } as MarkdownStyleConfig,

  /**
   * Spacious style preset
   * Generous spacing and larger fonts for comfortable reading
   */
  spacious: {
    ...defaultMarkdownStyle,
    typography: {
      ...defaultMarkdownStyle.typography,
      fontSize: '18px',
      lineHeight: '2',
    },
    headings: {
      ...defaultMarkdownStyle.headings,
      h2: {
        ...defaultMarkdownStyle.headings.h2,
        marginTop: '2.5em',
        marginBottom: '1.5em',
      },
    },
    paragraph: {
      marginBottom: '1.5em',
      textAlign: 'left',
    },
  } as MarkdownStyleConfig,

  /**
   * Minimal style preset
   * Clean and simple with minimal decorative elements
   */
  minimal: {
    ...defaultMarkdownStyle,
    headings: {
      ...defaultMarkdownStyle.headings,
      h2: {
        ...defaultMarkdownStyle.headings.h2,
        showDecorator: false,
        borderBottom: 'none',
      },
    },
    link: {
      ...defaultMarkdownStyle.link,
      underlineStyle: 'solid',
    },
    blockquote: {
      ...defaultMarkdownStyle.blockquote,
      showQuoteMark: false,
    },
    hr: {
      ...defaultMarkdownStyle.hr,
      showDecorator: false,
    },
  } as MarkdownStyleConfig,
};

/**
 * Current active Markdown style configuration
 * This is the style applied to all Markdown content rendering
 */
export const currentMarkdownStyle = defaultMarkdownStyle;
