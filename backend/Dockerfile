# Use Amazon Linux 2023 base image
FROM amazonlinux:2023

# Install Python 3.10, build tools, and MariaDB development libraries
RUN yum update -y && yum install -y \
    python3 \
    python3-pip \
    python3-devel \
    mariadb105-devel \
    gcc \
    libffi-devel \
    openssl-devel \
    make \
    && yum clean all

# Set the working directory inside the container
WORKDIR /app

# Copy the application code to the working directory
COPY . /app

# Install Python dependencies from requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port that the Flask app will run on
EXPOSE 5000

# Command to run the Flask application
CMD ["python3", "-m", "flask", "run", "--host=0.0.0.0"]
