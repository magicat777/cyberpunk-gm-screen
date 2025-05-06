// Test script for cloud storage adapter

class TestCloudStorage {
    constructor() {
        // If running in a browser, use the actual CloudStorageAdapter
        if (typeof window !== 'undefined' && window.cloudStorage) {
            this.cloudStorage = window.cloudStorage;
            this.runInBrowser = true;
        } else {
            // Mock the cloud storage adapter for Node.js testing
            this.cloudStorage = {
                init: async () => console.log('Mock init called'),
                saveItem: async (key, data) => console.log(`Mock saveItem called with key ${key}`),
                getItem: async (key) => console.log(`Mock getItem called with key ${key}`),
                removeItem: async (key) => console.log(`Mock removeItem called with key ${key}`),
                testConnection: async () => console.log('Mock testConnection called'),
                getStatus: () => ({ status: 'offline', isAvailable: false })
            };
            this.runInBrowser = false;
        }
    }
    
    /**
     * Initialize and test the cloud storage adapter
     */
    async runTests() {
        console.log('=== CLOUD STORAGE ADAPTER TESTS ===');
        
        try {
            // Initialize
            console.log('Initializing cloud storage...');
            const available = await this.cloudStorage.init();
            console.log(`Cloud storage available: ${available}`);
            
            // Get status
            const status = this.cloudStorage.getStatus();
            console.log('Status:', status);
            
            // Test connection
            console.log('Testing connection...');
            const connectionTest = await this.cloudStorage.testConnection();
            console.log(`Connection test result: ${connectionTest}`);
            
            // Save item
            console.log('Saving test item...');
            const testData = { message: 'This is test data', timestamp: new Date().toISOString() };
            const saveResult = await this.cloudStorage.saveItem('test-key', testData);
            console.log('Save result:', saveResult);
            
            // Get item
            console.log('Retrieving test item...');
            const getResult = await this.cloudStorage.getItem('test-key');
            console.log('Get result:', getResult);
            
            // Remove item
            console.log('Removing test item...');
            const removeResult = await this.cloudStorage.removeItem('test-key');
            console.log('Remove result:', removeResult);
            
            console.log('All tests completed!');
        } catch (error) {
            console.error('Error during tests:', error);
        }
    }
}

// If we're in the browser, expose the test runner globally
if (typeof window !== 'undefined') {
    window.cloudStorageTest = new TestCloudStorage();
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', () => {
        // Create UI elements
        const testBtn = document.createElement('button');
        testBtn.textContent = 'Run Cloud Storage Tests';
        testBtn.style.position = 'fixed';
        testBtn.style.top = '10px';
        testBtn.style.right = '10px';
        testBtn.style.zIndex = '10000';
        testBtn.style.padding = '10px';
        testBtn.style.backgroundColor = '#0066cc';
        testBtn.style.color = 'white';
        testBtn.style.border = 'none';
        testBtn.style.borderRadius = '4px';
        testBtn.style.cursor = 'pointer';
        
        // Add event listener
        testBtn.addEventListener('click', () => {
            console.clear();
            window.cloudStorageTest.runTests();
        });
        
        // Add to page
        document.body.appendChild(testBtn);
    });
} else {
    // If we're running in Node.js, run the tests immediately
    const tester = new TestCloudStorage();
    tester.runTests();
}