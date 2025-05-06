# Google Workspace (Andominia) Deployment Guide

This document outlines the plan for deploying the Cyberpunk RED GM Screen to Google Workspace (Andominia) to enable remote access from any device.

## Deployment Goals

1. Host the Cyberpunk RED GM Screen on Google Workspace for access from anywhere
2. Ensure data persistence between sessions
3. Implement proper authentication to protect game data
4. Maintain synchronization between local and cloud versions
5. Provide a user-friendly access URL

## Implementation Options

### Option 1: Google Sites Integration

**Description:** Deploy the application as a Google Sites website with embedded application.

**Pros:**
- Simple setup through Google Sites interface
- Automatic integration with Google Workspace authentication
- Easy sharing controls
- No additional hosting costs

**Cons:**
- Limited control over server configuration
- Potential JavaScript execution limitations
- Storage limitations for game data

**Implementation Steps:**
1. Create a new Google Site in your Andominia Workspace
2. Set up project structure with necessary HTML, CSS, and JS files
3. Configure site settings for proper access permissions
4. Adapt storage mechanism to use Google Drive API instead of localStorage

### Option 2: Google Cloud Run Service

**Description:** Deploy as a containerized application on Google Cloud Run with Google Workspace authentication.

**Pros:**
- Full control over application environment
- Better performance and scalability
- More storage options
- Works well with the existing Python server approach

**Cons:**
- More complex setup
- Potential additional costs
- Requires containerization knowledge

**Implementation Steps:**
1. Create a Dockerfile for the application
2. Set up a Google Cloud project linked to your Workspace
3. Deploy the container to Cloud Run
4. Configure Google Workspace authentication
5. Set up Cloud Storage for persistence

### Option 3: Google Drive Web Hosting

**Description:** Host the static files in Google Drive and use Drive's web hosting capabilities.

**Pros:**
- Simple setup with existing Google Drive
- No additional infrastructure needed
- Easy file updates through Drive interface

**Cons:**
- Limited server functionality
- Potential CORS issues
- Limited control over HTTP headers

**Implementation Steps:**
1. Create a dedicated folder in Google Drive
2. Upload all application files
3. Configure sharing settings appropriately
4. Use Google Drive's "Publish to the web" feature

## Recommended Approach

Based on the application's requirements, we recommend **Option 2: Google Cloud Run Service** for the following reasons:

1. It provides the most flexibility for running the Python HTTP server
2. It allows proper data persistence using Cloud Storage
3. It integrates well with Google Workspace authentication
4. It supports the application's dynamic nature better than static hosting

## Detailed Implementation Plan

### Phase 1: Preparation and Research

1. **Environment Assessment**
   - Review current application dependencies
   - Document data storage requirements
   - Identify Google Workspace domain settings

2. **Authentication Planning**
   - Determine authentication requirements
   - Review Google Workspace SSO options
   - Plan permission levels for different user types

3. **Data Migration Strategy**
   - Plan localStorage to Cloud Storage migration
   - Design data synchronization mechanism
   - Create backup approach for existing data

### Phase 2: Infrastructure Setup

1. **Google Cloud Project Creation**
   - Create new project in Google Cloud
   - Link to Google Workspace organization
   - Configure billing and quotas

2. **Container Setup**
   - Create Dockerfile:
     ```dockerfile
     FROM python:3-slim
     
     WORKDIR /app
     
     COPY . .
     
     # Install any dependencies (if any)
     RUN pip install --no-cache-dir -r requirements.txt
     
     # Expose the port the app runs on
     EXPOSE 8888
     
     # Command to run the app
     CMD ["python", "-m", "http.server", "8888"]
     ```

3. **Cloud Storage Configuration**
   - Create storage bucket for application data
   - Configure CORS settings for web access
   - Set up appropriate IAM permissions

### Phase 3: Application Adaptation

1. **Storage Mechanism Modifications**
   - Create Google Cloud Storage adapter
   - Modify localStorage calls to use Cloud Storage
   - Implement caching for performance

2. **Authentication Integration**
   - Add Google Sign-In functionality
   - Integrate Workspace user permissions
   - Create session management system

3. **URL and Domain Setup**
   - Configure custom domain or subdomain
   - Set up HTTPS with managed certificates
   - Configure DNS settings in Google Workspace

### Phase 4: Deployment and Testing

1. **Initial Deployment**
   - Build and push container to Google Container Registry
   - Deploy to Cloud Run
   - Configure auto-scaling and memory settings

2. **Testing Procedures**
   - Verify functionality across different devices
   - Test authentication flows
   - Validate data persistence
   - Performance testing under load

3. **Monitoring Setup**
   - Configure Cloud Monitoring alerts
   - Set up logging for application events
   - Create dashboard for application health

### Phase 5: Synchronization Setup

1. **Local-Cloud Sync**
   - Create synchronization mechanism between local and cloud instances
   - Set up conflict resolution policy
   - Implement automatic and manual sync triggers

2. **Backup Procedures**
   - Configure automatic backups to Google Drive
   - Create backup verification process
   - Document restoration procedures

## Cost Considerations

1. **Google Cloud Run**
   - Pay-per-use pricing model
   - Estimated monthly cost: $5-$15 for typical usage
   - Additional costs for storage and data transfer

2. **Cloud Storage**
   - Storage costs for application data
   - Read/write operation costs
   - Estimated monthly cost: $1-$5 for typical usage

3. **Optional Services**
   - Cloud CDN for improved performance: $10-$20/month
   - Custom domain mapping: $10-$12/year
   - Advanced security features: Varies

## Security Considerations

1. **Data Protection**
   - All data should be encrypted at rest using Google-managed encryption
   - Implement proper IAM roles for least privilege access
   - Regular security reviews and updates

2. **Authentication Security**
   - Use Google Workspace SSO for authentication
   - Implement session timeout policies
   - Consider enabling 2-step verification requirement

3. **Network Security**
   - Configure VPC Service Controls if needed
   - Implement proper CORS policies
   - Use HTTPS for all communications

## Timeline

1. **Phase 1 (Preparation)**: 1-2 weeks
2. **Phase 2 (Infrastructure)**: 1 week
3. **Phase 3 (Adaptation)**: 2-3 weeks
4. **Phase 4 (Deployment)**: 1 week
5. **Phase 5 (Synchronization)**: 1-2 weeks

**Total Estimated Time**: 6-9 weeks (part-time development)

## Alternative Simpler Approach

If the above approach seems too complex, a simpler solution would be:

1. Set up a small VM instance in Google Cloud
2. Install a basic HTTP server (Apache, Nginx, or Python's HTTP server)
3. Deploy the application files to the VM
4. Set up a systemd service similar to your current setup
5. Configure Google Workspace authentication through a reverse proxy

This approach would be less scalable but easier to implement as an initial solution.

## Next Steps

1. Conduct detailed assessment of Google Workspace (Andominia) configuration
2. Decide on the preferred deployment option
3. Create detailed project plan with timeframes
4. Test authentication integration in a sandbox environment
5. Begin infrastructure setup and implementation