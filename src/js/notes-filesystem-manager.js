// Notes Filesystem Manager
// Handles saving and loading notes using the File System Access API
// This provides access to the user's Documents folder with permission

class NotesFilesystemManager {
  constructor() {
    this.supportsFileSystemAccess = 'showSaveFilePicker' in window && 'showOpenFilePicker' in window;
    this.lastDirectoryHandle = null;
    this.documentsDirectory = null;
  }

  // Check if File System Access API is supported
  isSupported() {
    return this.supportsFileSystemAccess;
  }

  // Get or create a handle to the Documents directory
  async getDocumentsDirectory() {
    if (!this.isSupported()) {
      throw new Error('File System Access API not supported in this browser');
    }

    try {
      // Try to get the well-known Documents directory
      if ('getDirectory' in navigator.storage) {
        // This is a proposed API, may not be available yet
        this.documentsDirectory = await navigator.storage.getDirectory();
      }
      return this.documentsDirectory;
    } catch (error) {
      console.log('Cannot access Documents directory directly, will use file picker');
      return null;
    }
  }

  // Save notes to Documents directory
  async saveToDocuments(content, suggestedName = 'cyberpunk-notes.txt', fileType = 'text') {
    if (!this.isSupported()) {
      // Fallback to download
      return this.downloadFile(content, suggestedName, fileType);
    }

    try {
      const options = {
        suggestedName: suggestedName,
        types: this.getFileTypes(fileType),
        // Try to start in Documents if we have a handle
        startIn: this.lastDirectoryHandle || 'documents'
      };

      const handle = await window.showSaveFilePicker(options);
      this.lastDirectoryHandle = handle;

      // Create a writable stream
      const writable = await handle.createWritable();

      // Write the content
      await writable.write(content);

      // Close the file
      await writable.close();

      return {
        success: true,
        fileName: handle.name,
        message: `Saved to ${handle.name}`
      };
    } catch (error) {
      if (error.name === 'AbortError') {
        return { success: false, message: 'Save cancelled' };
      }
      throw error;
    }
  }

  // Load notes from Documents directory
  async loadFromDocuments(acceptedTypes = ['.txt', '.md', '.json']) {
    if (!this.isSupported()) {
      // Fallback to file input
      return this.loadViaFileInput(acceptedTypes);
    }

    try {
      const options = {
        types: [{
          description: 'Text files',
          accept: {
            'text/plain': ['.txt'],
            'text/markdown': ['.md'],
            'application/json': ['.json']
          }
        }],
        multiple: false,
        // Try to start in Documents or last used directory
        startIn: this.lastDirectoryHandle || 'documents'
      };

      const [fileHandle] = await window.showOpenFilePicker(options);
      this.lastDirectoryHandle = fileHandle;

      // Get the file
      const file = await fileHandle.getFile();

      // Read the content
      const content = await file.text();

      return {
        success: true,
        content: content,
        fileName: file.name,
        fileType: this.detectFileType(file.name)
      };
    } catch (error) {
      if (error.name === 'AbortError') {
        return { success: false, message: 'Load cancelled' };
      }
      throw error;
    }
  }

  // Quick save - saves to last location or prompts for new one
  async quickSave(content, fileName = null) {
    if (!this.isSupported() || !this.lastDirectoryHandle) {
      // First save or no API support - use save picker
      return this.saveToDocuments(content, fileName || 'cyberpunk-notes.txt');
    }

    try {
      // Try to use the last file handle
      if (this.lastDirectoryHandle && this.lastDirectoryHandle.kind === 'file') {
        const writable = await this.lastDirectoryHandle.createWritable();
        await writable.write(content);
        await writable.close();
        
        return {
          success: true,
          fileName: this.lastDirectoryHandle.name,
          message: `Quick saved to ${this.lastDirectoryHandle.name}`
        };
      } else {
        // Last handle was a directory, prompt for file
        return this.saveToDocuments(content, fileName);
      }
    } catch (error) {
      // Permission may have been revoked, prompt again
      return this.saveToDocuments(content, fileName);
    }
  }

  // Get file types for save dialog
  getFileTypes(fileType) {
    const types = {
      text: [{
        description: 'Text Files',
        accept: { 'text/plain': ['.txt'] }
      }],
      markdown: [{
        description: 'Markdown Files',
        accept: { 'text/markdown': ['.md'] }
      }],
      html: [{
        description: 'HTML Files',
        accept: { 'text/html': ['.html'] }
      }],
      json: [{
        description: 'JSON Files',
        accept: { 'application/json': ['.json'] }
      }]
    };

    return types[fileType] || types.text;
  }

  // Detect file type from extension
  detectFileType(fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    const typeMap = {
      'txt': 'text',
      'md': 'markdown',
      'html': 'html',
      'json': 'json'
    };
    return typeMap[ext] || 'text';
  }

  // Fallback download method
  downloadFile(content, fileName, fileType = 'text') {
    const mimeTypes = {
      text: 'text/plain',
      markdown: 'text/markdown',
      html: 'text/html',
      json: 'application/json'
    };

    const blob = new Blob([content], { type: mimeTypes[fileType] || 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return {
      success: true,
      fileName: fileName,
      message: `Downloaded ${fileName}`
    };
  }

  // Fallback file input method
  loadViaFileInput(acceptedTypes) {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = acceptedTypes.join(',');

      input.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
          try {
            const content = await file.text();
            resolve({
              success: true,
              content: content,
              fileName: file.name,
              fileType: this.detectFileType(file.name)
            });
          } catch (error) {
            resolve({
              success: false,
              message: 'Failed to read file: ' + error.message
            });
          }
        } else {
          resolve({ success: false, message: 'No file selected' });
        }
      });

      input.click();
    });
  }

  // Convert HTML to Markdown (basic conversion)
  htmlToMarkdown(html) {
    let markdown = html;
    
    // Headers
    markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
    markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
    markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
    markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');
    markdown = markdown.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n');
    markdown = markdown.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n');
    
    // Text formatting
    markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
    markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
    markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
    markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
    markdown = markdown.replace(/<u[^>]*>(.*?)<\/u>/gi, '$1');
    markdown = markdown.replace(/<s[^>]*>(.*?)<\/s>/gi, '~~$1~~');
    markdown = markdown.replace(/<strike[^>]*>(.*?)<\/strike>/gi, '~~$1~~');
    
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
    markdown = markdown.replace(/<div[^>]*>(.*?)<\/div>/gi, '$1\n');
    
    // Code
    markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
    markdown = markdown.replace(/<pre[^>]*>(.*?)<\/pre>/gi, '```\n$1\n```\n');
    
    // Blockquotes
    markdown = markdown.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, (match, content) => {
      return content.split('\n').map(line => '> ' + line).join('\n') + '\n';
    });
    
    // Remove remaining HTML tags
    markdown = markdown.replace(/<[^>]+>/g, '');
    
    // Clean up extra whitespace
    markdown = markdown.replace(/\n{3,}/g, '\n\n');
    markdown = markdown.trim();
    
    return markdown;
  }

  // Convert Markdown to HTML
  markdownToHtml(markdown) {
    let html = markdown;
    
    // Headers
    html = html.replace(/^###### (.*?)$/gm, '<h6>$1</h6>');
    html = html.replace(/^##### (.*?)$/gm, '<h5>$1</h5>');
    html = html.replace(/^#### (.*?)$/gm, '<h4>$1</h4>');
    html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
    
    // Bold
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    
    // Italic
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/_([^_]+)_/g, '<em>$1</em>');
    
    // Strikethrough
    html = html.replace(/~~([^~]+)~~/g, '<s>$1</s>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    
    // Code blocks
    html = html.replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>');
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Lists
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => '<ul>' + match + '</ul>');
    
    // Blockquotes
    html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
    
    // Paragraphs
    html = html.split('\n\n').map(para => {
      if (!para.match(/^<[^>]+>/)) {
        return '<p>' + para + '</p>';
      }
      return para;
    }).join('\n');
    
    // Line breaks
    html = html.replace(/\n/g, '<br>');
    
    return html;
  }
}

// Initialize global instance
window.notesFilesystemManager = new NotesFilesystemManager();