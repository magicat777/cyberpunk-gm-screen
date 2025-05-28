// Notes File Manager
// Handles saving and loading notes to/from files

class NotesFileManager {
  constructor() {
    this.defaultFileName = 'cyberpunk-notes';
  }

  // Save notes to a text file
  async saveToFile(content, fileName = null) {
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const name = fileName || `${this.defaultFileName}-${timestamp}.txt`;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Error saving file:', error);
      throw new Error('Failed to save file: ' + error.message);
    }
  }

  // Save notes as HTML with formatting
  async saveAsHtml(content, fileName = null) {
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const name = fileName || `${this.defaultFileName}-${timestamp}.html`;
      
      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cyberpunk GM Notes - ${timestamp}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background: #1a1a1a;
      color: #e0e0e0;
    }
    h1, h2, h3, h4, h5, h6 {
      color: #00ffff;
    }
    code {
      background: #2a2a2a;
      padding: 2px 4px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
    }
    pre {
      background: #2a2a2a;
      padding: 10px;
      border-radius: 5px;
      overflow-x: auto;
    }
    blockquote {
      border-left: 4px solid #00ffff;
      padding-left: 16px;
      margin-left: 0;
      color: #b0b0b0;
    }
    a {
      color: #00ffff;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 10px 0;
    }
    th, td {
      border: 1px solid #444;
      padding: 8px;
      text-align: left;
    }
    th {
      background: #2a2a2a;
      color: #00ffff;
    }
  </style>
</head>
<body>
  <h1>Cyberpunk GM Notes</h1>
  <p><em>Exported on ${new Date().toLocaleString()}</em></p>
  <hr>
  <div class="content">
    ${content}
  </div>
</body>
</html>`;
      
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Error saving HTML file:', error);
      throw new Error('Failed to save HTML file: ' + error.message);
    }
  }

  // Save notes as Markdown
  async saveAsMarkdown(htmlContent, fileName = null) {
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const name = fileName || `${this.defaultFileName}-${timestamp}.md`;
      
      // Convert HTML to Markdown (basic conversion)
      const markdown = this.htmlToMarkdown(htmlContent);
      
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Error saving Markdown file:', error);
      throw new Error('Failed to save Markdown file: ' + error.message);
    }
  }

  // Basic HTML to Markdown conversion
  htmlToMarkdown(html) {
    let markdown = html;
    
    // Headers
    markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
    markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
    markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
    markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');
    markdown = markdown.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n');
    markdown = markdown.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n');
    
    // Bold and Italic
    markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
    markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
    markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
    markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
    
    // Links
    markdown = markdown.replace(/<a[^>]+href="([^"]+)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
    
    // Lists
    markdown = markdown.replace(/<ul[^>]*>/gi, '\n');
    markdown = markdown.replace(/<\/ul>/gi, '\n');
    markdown = markdown.replace(/<ol[^>]*>/gi, '\n');
    markdown = markdown.replace(/<\/ol>/gi, '\n');
    markdown = markdown.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
    
    // Paragraphs and line breaks
    markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
    markdown = markdown.replace(/<br[^>]*>/gi, '\n');
    
    // Code
    markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
    markdown = markdown.replace(/<pre[^>]*>(.*?)<\/pre>/gi, '```\n$1\n```\n');
    
    // Blockquotes
    markdown = markdown.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n');
    
    // Remove remaining HTML tags
    markdown = markdown.replace(/<[^>]+>/g, '');
    
    // Clean up extra whitespace
    markdown = markdown.replace(/\n{3,}/g, '\n\n');
    
    return markdown.trim();
  }

  // Load notes from a file
  async loadFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const content = event.target.result;
          resolve(content);
        } catch (error) {
          reject(new Error('Failed to read file: ' + error.message));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  // Create file input for loading
  createFileInput(callback) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.md,.html';
    
    input.addEventListener('change', async (event) => {
      const file = event.target.files[0];
      if (file) {
        try {
          const content = await this.loadFromFile(file);
          callback(content, file.name);
        } catch (error) {
          alert('Error loading file: ' + error.message);
        }
      }
    });
    
    return input;
  }

  // Add file management UI to notes panel
  addFileManagementUI(editorId, getContent, setContent) {
    const container = document.createElement('div');
    container.className = 'notes-file-actions';
    container.innerHTML = `
      <button id="save-text-${editorId}" title="Save as Text">
        <span>💾</span> Save .txt
      </button>
      <button id="save-html-${editorId}" title="Save as HTML">
        <span>🌐</span> Save .html
      </button>
      <button id="save-markdown-${editorId}" title="Save as Markdown">
        <span>📝</span> Save .md
      </button>
      <button id="load-file-${editorId}" title="Load from File">
        <span>📂</span> Load
      </button>
    `;

    // Add event listeners
    container.querySelector(`#save-text-${editorId}`).addEventListener('click', async () => {
      try {
        const content = getContent();
        const textContent = content.replace(/<[^>]+>/g, ''); // Strip HTML tags
        await this.saveToFile(textContent);
        this.showNotification('Notes saved as text file');
      } catch (error) {
        alert('Error saving file: ' + error.message);
      }
    });

    container.querySelector(`#save-html-${editorId}`).addEventListener('click', async () => {
      try {
        const content = getContent();
        await this.saveAsHtml(content);
        this.showNotification('Notes saved as HTML file');
      } catch (error) {
        alert('Error saving file: ' + error.message);
      }
    });

    container.querySelector(`#save-markdown-${editorId}`).addEventListener('click', async () => {
      try {
        const content = getContent();
        await this.saveAsMarkdown(content);
        this.showNotification('Notes saved as Markdown file');
      } catch (error) {
        alert('Error saving file: ' + error.message);
      }
    });

    const loadButton = container.querySelector(`#load-file-${editorId}`);
    const fileInput = this.createFileInput((content, fileName) => {
      setContent(content);
      this.showNotification(`Loaded: ${fileName}`);
    });
    
    loadButton.addEventListener('click', () => {
      fileInput.click();
    });

    return container;
  }

  // Show notification
  showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(0, 255, 255, 0.9);
      color: #000;
      padding: 12px 20px;
      border-radius: 4px;
      font-weight: bold;
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
}

// Initialize global instance
window.notesFileManager = new NotesFileManager();

// Add animation styles if not already present
if (!document.getElementById('notes-file-manager-styles')) {
  const style = document.createElement('style');
  style.id = 'notes-file-manager-styles';
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}