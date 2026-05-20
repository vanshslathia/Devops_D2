# TechStore - MERN Ecommerce Application

A simple MERN (MongoDB, Express, React, Node.js) stack ecommerce application with Docker support.

## Project Structure
<!-- vansh  slathia -->
```
Ecommerce_devops/
├── backend/
│   ├── server.js           # Express server with MongoDB integration
│   ├── package.json        # Backend dependencies
│   ├── Dockerfile          # Backend container configuration
│   └── .env                # Environment variables
├── frontend/
│   ├── public/             # Static assets
│   │   └── index.html      # React root HTML
│   ├── src/                # React source code
│   │   ├── App.js          # Main App component
│   │   ├── index.js        # React entry point
│   │   ├── App.css         # Component styles
│   │   └── index.css       # Global styles
│   ├── package.json        # Frontend dependencies
│   ├── Dockerfile          # Frontend container configuration
│   └── .gitignore
├── docker-compose.yml      # Docker Compose configuration
└── README.md               # This file
```

## Tech Stack

- **Backend**: Node.js + Express.js
- **Frontend**: React 18
- **Database**: MongoDB
- **Containerization**: Docker & Docker Compose

## Prerequisites

- Node.js (v18+)
- Docker & Docker Compose
- MongoDB (if running locally without Docker)

## Installation

### Local Development

#### Backend Setup
```bash
cd backend
npm install
npm start
```
Backend will run on `http://localhost:5000`

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend will run on `http://localhost:3000`

#### Database Setup (Local MongoDB)
```bash
# Assuming MongoDB is installed and running
# The app will connect to mongodb://localhost:27017/techstore
```

### Docker Deployment

```bash
docker-compose up -d
```

This will start:
- Frontend on `http://localhost:3000`
- Backend API on `http://localhost:5000`
- MongoDB on `mongodb://localhost:27017`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order

### Health
- `GET /health` - Health check
- `GET /` - API info

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/techstore
```

### Docker Compose Override
Uses MongoDB credentials from docker-compose.yml

## Features

- ✅ Browse products
- ✅ Add products to cart
- ✅ Remove items from cart
- ✅ Real-time cart total calculation
- ✅ Responsive design
- ✅ MongoDB persistence
- ✅ RESTful API
- ✅ Docker containerization

## Development

### Adding Products
Send a POST request to `http://localhost:5000/api/products`:
```json
{
  "name": "Product Name",
  "price": 99.99,
  "description": "Product description",
  "category": "Electronics"
}
```

### Stopping Containers
```bash
docker-compose down
```

## License

ISC
    └── Jenkins CI/CD Automation
```

## Technology Stack

### Development
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Database:** In-memory storage (can be extended to MongoDB/PostgreSQL)

### DevOps & Deployment
- **Docker:** Container images for frontend and backend
- **Docker Compose:** Multi-container orchestration
- **Jenkins:** CI/CD pipeline automation
- **Git/GitHub:** Version control and webhooks

## Setup and Installation

### Prerequisites
- Docker & Docker Compose
- Node.js (for local development)
- Jenkins (for CI/CD pipeline)
- Git

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/your-repo/techstore.git
cd techstore
```

2. **Backend Setup**
```bash
cd backend
npm install
npm start
# Backend runs on http://localhost:3000
```

3. **Frontend Setup**
Open `frontend/index.html` in a browser or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server frontend
```

### Docker Deployment

1. **Build and run with Docker Compose**
```bash
docker-compose up --build
```

2. **Access the application**
- Frontend: http://localhost:8080
- Backend API: http://localhost:3000

3. **Stop the services**
```bash
docker-compose down
```

## CI/CD Pipeline with Jenkins

### Pipeline Stages
1. **Checkout** - Pull code from GitHub
2. **Build Frontend** - Create frontend Docker image
3. **Build Backend** - Create backend Docker image
4. **Test Backend** - Run automated tests
5. **Deploy Microservices** - Deploy containers

### Jenkinsfile Configuration
The `Jenkinsfile` automates:
- Building Docker images for both services
- Running tests
- Deploying containers
- Managing microservices orchestration

## API Usage Examples

### Get All Products
```bash
curl http://localhost:3000/api/products
```

### Add to Cart
```bash
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "quantity": 2}'
```

### Place Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"email": "customer@example.com", "address": "123 Main St"}'
```

## Project Structure

```
techstore/
├── frontend/
│   ├── index.html       # Main product catalog
│   ├── script.js        # Ecommerce logic
│   ├── style.css        # Responsive styling
│   └── Dockerfile       # Frontend container
├── backend/
│   ├── server.js        # Express API server
│   ├── package.json     # Dependencies
│   ├── Dockerfile       # Backend container
│   └── test_backend.py  # Test suite
├── docker-compose.yml   # Multi-container config
├── Jenkinsfile          # CI/CD pipeline
└── README.md            # Documentation
```

## Features Walkthrough

### 1. Browse Products
- View all tech products on the homepage
- Products are categorized (Electronics, Accessories)
- Filter by category to narrow down choices

### 2. Add to Cart
- Select quantity and click "Add to Cart"
- Cart updates in real-time
- Multiple items can be added

### 3. View Shopping Cart
- Click cart button to view items
- See subtotal, tax (10%), and total
- Remove items from cart as needed

### 4. Checkout
- Provide email and shipping address
- Review order summary
- Click "Place Order" to confirm

### 5. Order Confirmation
- See order number and details
- Confirmation with all purchased items
- Ready for next purchase

## Deployment Options

### Docker Compose (Local)
```bash
docker-compose up --build
```

### Kubernetes (Production)
Can be extended to deploy on Kubernetes using:
- Container images from Docker Hub
- Kubernetes manifests for services
- Persistent volumes for data

### Azure/AWS/GCP
Can be deployed to cloud platforms with:
- App Services or Container Apps
- Cloud-managed databases
- CDN for static assets

## Testing

### Backend Tests
```bash
cd backend
python test_backend.py
```

### Manual Testing
1. Open frontend in browser
2. Add products to cart
3. Complete checkout process
4. Verify orders in backend API

## Scaling Considerations

### Horizontal Scaling
- Frontend: Serve via CDN or load balancer
- Backend: Multiple instances with load balancer
- Database: Move to managed database service

### Vertical Scaling
- Increase container resource limits
- Optimize code and queries
- Use caching mechanisms

## Security Enhancements

- Add authentication (JWT/OAuth2)
- Implement payment gateway (Stripe/PayPal)
- Add HTTPS/TLS
- Input validation and sanitization
- CORS configuration

## Future Enhancements

- [ ] User accounts and login system
- [ ] Product reviews and ratings
- [ ] Advanced search and filters
- [ ] Payment processing integration
- [ ] Order tracking
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] Database integration (MongoDB/PostgreSQL)

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

This project is licensed under the ISC License.

## Contact & Support

For questions or support, please open an issue on GitHub or contact the development team.

---

**Happy Coding! 🚀** Build and deploy with confidence using TechStore's microservices architecture!
3. After installation, open Docker Desktop and ensure it's running.
4. At the end of this document, I have outlined the problems encountered and their possible solutions.

![image](https://github.com/user-attachments/assets/32d1de70-0f5f-4aae-85a9-fac1ced91904)

### Installing Required Jenkins Plugins

1. Open Jenkins in your web browser.
2. Go to **Manage Jenkins** > **Manage Plugins**.
3. In the **Available** tab, search for and install the following plugins:
   - **Docker Pipeline**
   - **Git**
   - **Pipeline**
4. After installation, restart Jenkins to ensure the plugins are loaded.

![image](https://github.com/user-attachments/assets/d72efb2a-451e-4bbc-9f48-1787b6aa0ad0)

## 4. Microservices Structure

- **Initializing the Git and GitHub Repo**
  - Went to GitHub and created a new repository (e.g., `microservice-cicd`).
  - Initialized it with a `README.md` file.
  - Cloned it to the local machine using Git.

![image](https://github.com/user-attachments/assets/bd683bd4-a0a5-4a0e-bb05-b27b754a59a6)

- **Frontend Service (HTML, CSS, JavaScript)**
  - Developed a responsive frontend using HTML, CSS, and JavaScript.
  - The frontend connects to the backend service through RESTful APIs.

![image](https://github.com/user-attachments/assets/8e435aca-c8da-49b4-9747-fa03b85e1bce)

- **Backend Service (Node.js)**
  - Built a backend service using Node.js and Express to handle API requests.
  - The backend processes data and communicates with the frontend.

![image](https://github.com/user-attachments/assets/e0fe9b76-3bcd-427e-8e40-96472e41fa02)
![image](https://github.com/user-attachments/assets/36ae324d-99c3-445c-b888-5a6eae8c5d1e)

- **Finalizing and Pushing Changes to GitHub**
  - Committed the final changes to the local Git repository with a descriptive message.
  - Pushed the committed changes to the GitHub repository, ensuring the latest updates are reflected.
  - Updated the README file with the final project details, including steps, screenshots, and outcomes.

![image](https://github.com/user-attachments/assets/0ff6c5b8-67d1-40d2-94dd-c803b2244307)

## 5. CI/CD Pipeline Implementation

- **Jenkins Configuration**
  - Configured Jenkins for continuous integration and deployment.
  - Triggered the build process with Poll SCM and whenever changes are made to Github Repo.
    
    ![image](https://github.com/user-attachments/assets/cb674546-3314-4f3f-a912-86d76054b2f1)

  - Set up Jenkins on Docker to automate the build, test, and deployment processes.

![image](https://github.com/user-attachments/assets/96a035e6-7677-4427-8c8b-4f55fc45abdd)

- **Jenkinsfile Automate Process**
  - Created a Jenkinsfile to define the pipeline stages: Checkout, Build, Test, and Deploy.
  - Integrated Jenkins with GitHub to trigger builds on code commits.
 
![image](https://github.com/user-attachments/assets/e4ac58d1-e364-4570-91f4-e2ea225d386a)

- **Docker Integration**
  - Dockerized both frontend and backend services for consistent environments across development and testing.
  - Used Docker Compose to manage multi-container applications.
**The encountered problems and their potential solutions are discussed in the end.**
## 6. Testing and Validation

For automated testing of the backend microservice, I used Python’s `unittest` module. This module provides a framework for writing and running tests, which helps ensure that the backend code functions correctly.

- **Basic Example of `unittest` in Python**

Here's how I used `unittest` to test the backend microservice:

![image](https://github.com/user-attachments/assets/b61c4a8d-f734-4b44-9a52-cb4986fcfe43)

Code is available in the Backend folder with the name `test_backend.py`.

## 7. Deployment

### Dockerized Microservices on Windows - Manual Deployment of Docker container

1. **Build Docker Images**:
    - Created Docker images for the frontend and backend using the Dockerfile in their respective directories.
    ```bash
    cd frontend
    docker build -t frontend:latest .
    ```
    ```bash
    cd ../backend
    docker build -t backend:latest .
    ```

2. **Run Docker Containers**:
    - Launched the frontend and backend containers in detached mode, mapping appropriate ports to the host.
    ```bash
    docker run -d -p 80:80 frontend:latest
    ```
    ```bash
    docker run -d -p 3000:3000 backend:latest
    ```

3. **Verify Running Containers**:
    - Verified that both containers were running by listing active containers and using dockers desktop.
    ```bash
    docker ps
    ```
![image](https://github.com/user-attachments/assets/5c1769cc-55fa-4528-b8e6-fc5b81ec744a)

4. **Access Applications**:
    - **Frontend**: Accessed via `http://localhost`.
    - **Backend**: Accessed via `http://localhost:3000/data`.

5. **Running the Pipeline in Jenkins - Automated Build and Deploy**
   - Executed the CI/CD pipeline in Jenkins.
   - Deployed updates automatically to the Dockerized environment upon code changes.

![image](https://github.com/user-attachments/assets/104633e9-53f0-4c61-8454-6bfc9c21f78a)

## 8. Project Outcome

- Achieved a fully automated CI/CD pipeline that builds, tests, and deploys microservices.
- Deployed a robust microservices architecture using Docker and Jenkins.
- Gained practical experience in Git, GitHub, Jenkins, Docker, and microservices architecture.

## 9. Problems and Solutions

### Docker Container Issues:

**Problem:** Containers failed to start.
**Solution:** Reviewed logs, fixed Dockerfile configurations, resolved port conflicts, and adjusted network settings.

### Jenkins Pipeline Failures:

**Problem:** Build failures.
**Solution:** Corrected Jenkinsfile syntax, installed necessary dependencies, and updated Jenkins plugins.

### Jenkins Not Pulling Latest Code:

**Problem:** Deploying outdated code.
**Solution:** Checked repository URL and branch settings.

### Testing Failures in Jenkins:

**Problem:** Tests failed.
**Solution:** Ensured test framework and scripts were correctly configured.

### Misconfigured Jenkins Agents:

**Problem:** Agent configuration issues.
**Solution:** Reconfigured agents and reviewed logs.

These were some of the main issues I encountered. I utilized resources such as Stack Overflow, YouTube, and Google to resolve these errors and misconfigurations. Apart from that,
This project provided a comprehensive understanding of DevOps practices, microservices, Docker, and Jenkins. I learned to automate the build, test, and deployment processes effectively, preparing me for real-world software development and DevOps roles.
