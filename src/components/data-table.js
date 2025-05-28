/**
 * DataTable Web Component
 * A cyberpunk-styled data table with sorting, filtering, and pagination
 */

class DataTable extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Default properties
    this._data = [];
    this._columns = [];
    this._sortColumn = null;
    this._sortDirection = 'asc';
    this._filterText = '';
    this._currentPage = 1;
    this._pageSize = 10;
    this._selectable = false;
    this._multiSelect = false;
    this._selectedRows = new Set();
    this._loading = false;
    this._variant = 'default';
  }
  
  static get observedAttributes() {
    return [
      'selectable', 'multi-select', 'page-size', 'loading', 
      'variant', 'compact', 'striped', 'bordered'
    ];
  }
  
  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'selectable':
        this._selectable = newValue !== null;
        break;
      case 'multi-select':
        this._multiSelect = newValue !== null;
        break;
      case 'page-size':
        this._pageSize = parseInt(newValue) || 10;
        break;
      case 'loading':
        this._loading = newValue !== null;
        break;
      case 'variant':
        this._variant = newValue || 'default';
        break;
      case 'compact':
        this._compact = newValue !== null;
        break;
      case 'striped':
        this._striped = newValue !== null;
        break;
      case 'bordered':
        this._bordered = newValue !== null;
        break;
    }
    
    if (this.shadowRoot && oldValue !== newValue) {
      this.render();
    }
  }
  
  render() {
    const styles = this.getStyles();
    const template = this.getTemplate();
    
    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      ${template}
    `;
    
    this.renderTable();
  }
  
  getStyles() {
    return `
      :host {
        display: block;
        --table-primary: var(--primary, #00ffff);
        --table-secondary: var(--secondary, #ff00ff);
        --table-accent: var(--accent, #ffff00);
        --table-bg: var(--bg-surface, rgba(255, 255, 255, 0.05));
        --table-border: var(--border-color, rgba(0, 255, 255, 0.3));
        --table-text: var(--text-primary, #e0e0e0);
        --table-text-secondary: var(--text-secondary, #a0a0a0);
        --table-hover: rgba(0, 255, 255, 0.1);
        --table-selected: rgba(0, 255, 255, 0.2);
      }
      
      .data-table-container {
        background: var(--table-bg);
        border: 1px solid var(--table-border);
        border-radius: 8px;
        overflow: hidden;
        font-family: var(--font-mono, 'Share Tech Mono', monospace);
        position: relative;
      }
      
      /* Header with search and controls */
      .table-header {
        background: rgba(0, 0, 0, 0.3);
        border-bottom: 1px solid var(--table-border);
        padding: 16px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
      }
      
      .table-title {
        color: var(--table-primary);
        font-family: var(--font-display, 'Orbitron', sans-serif);
        font-size: 18px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin: 0;
      }
      
      .table-controls {
        display: flex;
        gap: 15px;
        align-items: center;
        flex-wrap: wrap;
      }
      
      .search-container {
        position: relative;
      }
      
      .search-input {
        background: var(--table-bg);
        border: 1px solid var(--table-border);
        color: var(--table-text);
        padding: 8px 12px;
        border-radius: 4px;
        font-family: var(--font-mono);
        font-size: 14px;
        width: 200px;
      }
      
      .search-input:focus {
        outline: none;
        border-color: var(--table-primary);
        box-shadow: 0 0 5px var(--table-primary);
      }
      
      .table-info {
        color: var(--table-text-secondary);
        font-size: 14px;
      }
      
      /* Table wrapper for scroll */
      .table-wrapper {
        overflow-x: auto;
        overflow-y: auto;
        max-height: 400px;
      }
      
      .table-wrapper::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      
      .table-wrapper::-webkit-scrollbar-track {
        background: var(--table-bg);
      }
      
      .table-wrapper::-webkit-scrollbar-thumb {
        background: var(--table-border);
        border-radius: 4px;
      }
      
      .table-wrapper::-webkit-scrollbar-thumb:hover {
        background: var(--table-primary);
      }
      
      /* Table styling */
      .data-table {
        width: 100%;
        border-collapse: collapse;
        color: var(--table-text);
      }
      
      .data-table th,
      .data-table td {
        padding: 12px 16px;
        text-align: left;
        border-bottom: 1px solid var(--table-border);
        position: relative;
      }
      
      /* Compact variant */
      :host([compact]) .data-table th,
      :host([compact]) .data-table td {
        padding: 8px 12px;
      }
      
      /* Bordered variant */
      :host([bordered]) .data-table th,
      :host([bordered]) .data-table td {
        border: 1px solid var(--table-border);
      }
      
      /* Header styling */
      .data-table thead {
        background: rgba(0, 0, 0, 0.5);
        position: sticky;
        top: 0;
        z-index: 10;
      }
      
      .data-table th {
        color: var(--table-primary);
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-size: 14px;
        cursor: pointer;
        user-select: none;
        transition: all 0.3s;
      }
      
      .data-table th:hover {
        background: var(--table-hover);
        color: var(--table-accent);
      }
      
      .data-table th.sortable::after {
        content: '⇅';
        margin-left: 8px;
        opacity: 0.5;
      }
      
      .data-table th.sorted-asc::after {
        content: '↑';
        opacity: 1;
        color: var(--table-accent);
      }
      
      .data-table th.sorted-desc::after {
        content: '↓';
        opacity: 1;
        color: var(--table-accent);
      }
      
      /* Row styling */
      .data-table tbody tr {
        transition: all 0.3s;
        cursor: pointer;
      }
      
      .data-table tbody tr:hover {
        background: var(--table-hover);
      }
      
      /* Striped variant */
      :host([striped]) .data-table tbody tr:nth-child(even) {
        background: rgba(0, 0, 0, 0.2);
      }
      
      :host([striped]) .data-table tbody tr:nth-child(even):hover {
        background: var(--table-hover);
      }
      
      /* Selected rows */
      .data-table tbody tr.selected {
        background: var(--table-selected) !important;
        border-left: 3px solid var(--table-primary);
      }
      
      /* Checkbox column */
      .data-table .checkbox-cell {
        width: 40px;
        text-align: center;
      }
      
      .row-checkbox {
        width: 16px;
        height: 16px;
        accent-color: var(--table-primary);
      }
      
      /* Footer with pagination */
      .table-footer {
        background: rgba(0, 0, 0, 0.3);
        border-top: 1px solid var(--table-border);
        padding: 16px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
      }
      
      .pagination-info {
        color: var(--table-text-secondary);
        font-size: 14px;
      }
      
      .pagination-controls {
        display: flex;
        gap: 5px;
        align-items: center;
      }
      
      .pagination-btn {
        background: var(--table-bg);
        border: 1px solid var(--table-border);
        color: var(--table-text);
        padding: 6px 12px;
        cursor: pointer;
        border-radius: 4px;
        font-family: var(--font-mono);
        font-size: 14px;
        transition: all 0.3s;
      }
      
      .pagination-btn:hover:not(.disabled) {
        border-color: var(--table-primary);
        color: var(--table-primary);
      }
      
      .pagination-btn.active {
        background: var(--table-primary);
        color: var(--bg-primary, #000);
        border-color: var(--table-primary);
      }
      
      .pagination-btn.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      .page-size-selector {
        background: var(--table-bg);
        border: 1px solid var(--table-border);
        color: var(--table-text);
        padding: 6px 8px;
        border-radius: 4px;
        font-family: var(--font-mono);
        font-size: 14px;
      }
      
      /* Loading overlay */
      .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100;
      }
      
      .loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid var(--table-border);
        border-top: 3px solid var(--table-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      /* Empty state */
      .empty-state {
        text-align: center;
        padding: 40px 20px;
        color: var(--table-text-secondary);
      }
      
      .empty-state .icon {
        font-size: 48px;
        margin-bottom: 16px;
        opacity: 0.5;
      }
      
      /* Responsive */
      @media (max-width: 768px) {
        .table-header {
          flex-direction: column;
          align-items: stretch;
        }
        
        .table-controls {
          justify-content: space-between;
        }
        
        .search-input {
          width: 100%;
        }
        
        .table-footer {
          flex-direction: column;
          align-items: stretch;
        }
        
        .pagination-controls {
          justify-content: center;
        }
      }
      
      /* Scan line effect on hover */
      .scan-line {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(
          90deg,
          transparent 0%,
          var(--table-primary) 50%,
          transparent 100%
        );
        opacity: 0;
        transform: translateY(-100%);
        pointer-events: none;
      }
      
      .data-table tbody tr:hover .scan-line {
        opacity: 0.8;
        animation: scan 1s linear;
      }
      
      @keyframes scan {
        0% {
          transform: translateY(-100%);
        }
        100% {
          transform: translateY(100%);
        }
      }
    `;
  }
  
  getTemplate() {
    return `
      <div class="data-table-container">
        ${this._loading ? `
          <div class="loading-overlay">
            <div class="loading-spinner"></div>
          </div>
        ` : ''}
        
        <div class="table-header">
          <h3 class="table-title" id="table-title">Data Table</h3>
          <div class="table-controls">
            <div class="search-container">
              <input type="text" 
                     class="search-input" 
                     placeholder="Search..." 
                     id="search-input">
            </div>
            <div class="table-info" id="table-info">
              0 items
            </div>
          </div>
        </div>
        
        <div class="table-wrapper">
          <table class="data-table" id="data-table">
            <thead id="table-head"></thead>
            <tbody id="table-body"></tbody>
          </table>
        </div>
        
        <div class="table-footer">
          <div class="pagination-info" id="pagination-info">
            Showing 0 of 0 items
          </div>
          <div class="pagination-controls">
            <label>
              Rows per page:
              <select class="page-size-selector" id="page-size-selector">
                <option value="5">5</option>
                <option value="10" selected>10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </label>
            <div id="pagination-buttons"></div>
          </div>
        </div>
      </div>
    `;
  }
  
  setupEventListeners() {
    // Search input
    const searchInput = this.shadowRoot.querySelector('#search-input');
    searchInput.addEventListener('input', (e) => {
      this._filterText = e.target.value.toLowerCase();
      this._currentPage = 1;
      this.renderTable();
    });
    
    // Page size selector
    const pageSizeSelector = this.shadowRoot.querySelector('#page-size-selector');
    pageSizeSelector.addEventListener('change', (e) => {
      this._pageSize = parseInt(e.target.value);
      this._currentPage = 1;
      this.renderTable();
    });
  }
  
  renderTable() {
    const filteredData = this.getFilteredData();
    const paginatedData = this.getPaginatedData(filteredData);
    
    this.renderHeader();
    this.renderBody(paginatedData);
    this.renderPagination(filteredData.length);
    this.updateInfo(filteredData.length);
  }
  
  renderHeader() {
    const thead = this.shadowRoot.querySelector('#table-head');
    if (this._columns.length === 0) return;
    
    let headerHtml = '<tr>';
    
    // Checkbox column if selectable
    if (this._selectable && this._multiSelect) {
      headerHtml += `
        <th class="checkbox-cell">
          <input type="checkbox" 
                 class="row-checkbox" 
                 id="select-all"
                 ${this._selectedRows.size === this._data.length && this._data.length > 0 ? 'checked' : ''}>
        </th>
      `;
    } else if (this._selectable) {
      headerHtml += '<th class="checkbox-cell"></th>';
    }
    
    // Column headers
    this._columns.forEach(column => {
      const sortable = column.sortable !== false;
      const sortClass = this._sortColumn === column.key ? 
        `sorted-${this._sortDirection}` : 
        (sortable ? 'sortable' : '');
      
      headerHtml += `
        <th class="${sortClass}" 
            data-column="${column.key}"
            style="width: ${column.width || 'auto'}">
          ${column.title || column.key}
        </th>
      `;
    });
    
    headerHtml += '</tr>';
    thead.innerHTML = headerHtml;
    
    // Add sort event listeners
    this._columns.forEach(column => {
      if (column.sortable !== false) {
        const th = thead.querySelector(`[data-column="${column.key}"]`);
        th.addEventListener('click', () => this.sortBy(column.key));
      }
    });
    
    // Select all checkbox
    if (this._selectable && this._multiSelect) {
      const selectAll = thead.querySelector('#select-all');
      selectAll.addEventListener('change', (e) => {
        if (e.target.checked) {
          this._data.forEach((_, index) => this._selectedRows.add(index));
        } else {
          this._selectedRows.clear();
        }
        this.renderTable();
        this.dispatchSelectionChange();
      });
    }
  }
  
  renderBody(data) {
    const tbody = this.shadowRoot.querySelector('#table-body');
    
    if (data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="${this._columns.length + (this._selectable ? 1 : 0)}">
            <div class="empty-state">
              <div class="icon">📊</div>
              <div>No data available</div>
              ${this._filterText ? '<div>Try adjusting your search</div>' : ''}
            </div>
          </td>
        </tr>
      `;
      return;
    }
    
    let bodyHtml = '';
    
    data.forEach((row, index) => {
      const rowIndex = this.getOriginalRowIndex(row);
      const isSelected = this._selectedRows.has(rowIndex);
      
      bodyHtml += `<tr class="${isSelected ? 'selected' : ''}" data-index="${rowIndex}">`;
      
      // Checkbox column
      if (this._selectable) {
        const inputType = this._multiSelect ? 'checkbox' : 'radio';
        bodyHtml += `
          <td class="checkbox-cell">
            <input type="${inputType}" 
                   class="row-checkbox" 
                   name="row-select"
                   value="${rowIndex}"
                   ${isSelected ? 'checked' : ''}>
          </td>
        `;
      }
      
      // Data columns
      this._columns.forEach(column => {
        let value = this.getCellValue(row, column.key);
        
        // Apply formatter if provided
        if (column.formatter) {
          value = column.formatter(value, row, rowIndex);
        }
        
        // Apply renderer if provided
        if (column.render) {
          value = column.render(value, row, rowIndex);
        }
        
        bodyHtml += `
          <td class="${column.className || ''}" 
              data-column="${column.key}">
            ${value}
            <div class="scan-line"></div>
          </td>
        `;
      });
      
      bodyHtml += '</tr>';
    });
    
    tbody.innerHTML = bodyHtml;
    
    // Add row event listeners
    const rows = tbody.querySelectorAll('tr[data-index]');
    rows.forEach(row => {
      const rowIndex = parseInt(row.dataset.index);
      
      // Row click selection
      if (this._selectable) {
        const checkbox = row.querySelector('.row-checkbox');
        
        row.addEventListener('click', (e) => {
          if (e.target.type === 'checkbox' || e.target.type === 'radio') return;
          
          if (this._multiSelect) {
            if (this._selectedRows.has(rowIndex)) {
              this._selectedRows.delete(rowIndex);
              checkbox.checked = false;
            } else {
              this._selectedRows.add(rowIndex);
              checkbox.checked = true;
            }
          } else {
            this._selectedRows.clear();
            this._selectedRows.add(rowIndex);
            tbody.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = false);
            checkbox.checked = true;
          }
          
          this.renderTable();
          this.dispatchSelectionChange();
        });
        
        // Checkbox change
        checkbox.addEventListener('change', (e) => {
          if (e.target.checked) {
            if (!this._multiSelect) {
              this._selectedRows.clear();
            }
            this._selectedRows.add(rowIndex);
          } else {
            this._selectedRows.delete(rowIndex);
          }
          
          this.renderTable();
          this.dispatchSelectionChange();
        });
      }
      
      // Row click event
      row.addEventListener('click', (e) => {
        this.dispatchEvent(new CustomEvent('row-click', {
          bubbles: true,
          composed: true,
          detail: { 
            row: this._data[rowIndex], 
            index: rowIndex,
            originalEvent: e 
          }
        }));
      });
    });
  }
  
  renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / this._pageSize);
    const paginationButtons = this.shadowRoot.querySelector('#pagination-buttons');
    
    if (totalPages <= 1) {
      paginationButtons.innerHTML = '';
      return;
    }
    
    let buttonsHtml = '';
    
    // Previous button
    buttonsHtml += `
      <button class="pagination-btn ${this._currentPage <= 1 ? 'disabled' : ''}" 
              data-page="prev">‹</button>
    `;
    
    // Page numbers
    const startPage = Math.max(1, this._currentPage - 2);
    const endPage = Math.min(totalPages, this._currentPage + 2);
    
    if (startPage > 1) {
      buttonsHtml += `<button class="pagination-btn" data-page="1">1</button>`;
      if (startPage > 2) {
        buttonsHtml += `<span class="pagination-ellipsis">...</span>`;
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      buttonsHtml += `
        <button class="pagination-btn ${i === this._currentPage ? 'active' : ''}" 
                data-page="${i}">${i}</button>
      `;
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttonsHtml += `<span class="pagination-ellipsis">...</span>`;
      }
      buttonsHtml += `<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`;
    }
    
    // Next button
    buttonsHtml += `
      <button class="pagination-btn ${this._currentPage >= totalPages ? 'disabled' : ''}" 
              data-page="next">›</button>
    `;
    
    paginationButtons.innerHTML = buttonsHtml;
    
    // Add pagination event listeners
    const buttons = paginationButtons.querySelectorAll('.pagination-btn:not(.disabled)');
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const page = button.dataset.page;
        
        if (page === 'prev') {
          this._currentPage = Math.max(1, this._currentPage - 1);
        } else if (page === 'next') {
          this._currentPage = Math.min(totalPages, this._currentPage + 1);
        } else {
          this._currentPage = parseInt(page);
        }
        
        this.renderTable();
      });
    });
  }
  
  updateInfo(totalItems) {
    const tableInfo = this.shadowRoot.querySelector('#table-info');
    const paginationInfo = this.shadowRoot.querySelector('#pagination-info');
    
    tableInfo.textContent = `${totalItems} items`;
    
    const startItem = (this._currentPage - 1) * this._pageSize + 1;
    const endItem = Math.min(this._currentPage * this._pageSize, totalItems);
    
    paginationInfo.textContent = totalItems > 0 ? 
      `Showing ${startItem}-${endItem} of ${totalItems} items` :
      'No items to display';
  }
  
  getFilteredData() {
    if (!this._filterText) return this._data;
    
    return this._data.filter(row => {
      return this._columns.some(column => {
        const value = this.getCellValue(row, column.key);
        return String(value).toLowerCase().includes(this._filterText);
      });
    });
  }
  
  getPaginatedData(data) {
    const startIndex = (this._currentPage - 1) * this._pageSize;
    const endIndex = startIndex + this._pageSize;
    return data.slice(startIndex, endIndex);
  }
  
  getCellValue(row, key) {
    return key.split('.').reduce((obj, key) => obj?.[key], row) ?? '';
  }
  
  getOriginalRowIndex(row) {
    return this._data.indexOf(row);
  }
  
  sortBy(columnKey) {
    if (this._sortColumn === columnKey) {
      this._sortDirection = this._sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this._sortColumn = columnKey;
      this._sortDirection = 'asc';
    }
    
    this._data.sort((a, b) => {
      const aVal = this.getCellValue(a, columnKey);
      const bVal = this.getCellValue(b, columnKey);
      
      let result = 0;
      if (aVal < bVal) result = -1;
      else if (aVal > bVal) result = 1;
      
      return this._sortDirection === 'desc' ? -result : result;
    });
    
    this._currentPage = 1;
    this.renderTable();
  }
  
  dispatchSelectionChange() {
    const selectedData = Array.from(this._selectedRows).map(index => this._data[index]);
    
    this.dispatchEvent(new CustomEvent('selection-change', {
      bubbles: true,
      composed: true,
      detail: { 
        selectedRows: selectedData,
        selectedIndices: Array.from(this._selectedRows)
      }
    }));
  }
  
  // Public API
  setData(data, columns) {
    this._data = data || [];
    if (columns) {
      this._columns = columns;
    }
    this._currentPage = 1;
    this._selectedRows.clear();
    this.renderTable();
  }
  
  setColumns(columns) {
    this._columns = columns || [];
    this.renderTable();
  }
  
  addRow(row) {
    this._data.push(row);
    this.renderTable();
  }
  
  removeRow(index) {
    this._data.splice(index, 1);
    this._selectedRows.delete(index);
    this.renderTable();
  }
  
  updateRow(index, row) {
    this._data[index] = row;
    this.renderTable();
  }
  
  getSelectedRows() {
    return Array.from(this._selectedRows).map(index => this._data[index]);
  }
  
  clearSelection() {
    this._selectedRows.clear();
    this.renderTable();
  }
  
  setLoading(loading) {
    this._loading = loading;
    this.render();
  }
  
  setTitle(title) {
    const titleElement = this.shadowRoot.querySelector('#table-title');
    if (titleElement) {
      titleElement.textContent = title;
    }
  }
  
  refresh() {
    this.renderTable();
  }
}

// Register the component
customElements.define('data-table', DataTable);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DataTable;
}