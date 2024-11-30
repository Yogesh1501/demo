# Use the official Python image from the Docker Hub
FROM python:3.11 AS backend

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file to the working directory
COPY Backend/requirements.txt ./ 

# Upgrade pip and install the backend dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code to the working directory
COPY Backend/Dockerfile # Copy all backend files

# Expose the port your backend application runs on
EXPOSE 5000

# Command to run the backend application
CMD ["python", "app.py"]
