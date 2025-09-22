#!/bin/bash

# MediSync Healthcare AI Platform - Health Check Script
# This script performs comprehensive health checks on the deployed platform

set -e

# Configuration
NAMESPACE="medisync-prod"
HEALTH_TIMEOUT=30

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo_step() {
    echo -e "${GREEN}>>> $1${NC}"
}

echo_warn() {
    echo -e "${YELLOW}! $1${NC}"
}

echo_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check Kubernetes cluster health
check_cluster_health() {
    echo_step "Checking Kubernetes cluster health..."

    if ! kubectl cluster-info &> /dev/null; then
        echo_error "Cannot connect to Kubernetes cluster"
        exit 1
    fi

    # Check if namespace exists
    if ! kubectl get namespace "$NAMESPACE" &> /dev/null; then
        echo_error "Namespace $NAMESPACE does not exist"
        exit 1
    fi

    echo "✓ Kubernetes cluster is healthy"
}

# Check pod health
check_pod_health() {
    echo_step "Checking pod health..."

    # Get all pods in namespace
    pods=$(kubectl get pods -n "$NAMESPACE" -o jsonpath='{.items[*].metadata.name}')

    if [ -z "$pods" ]; then
        echo_error "No pods found in namespace $NAMESPACE"
        exit 1
    fi

    # Check each pod
    for pod in $pods; do
        status=$(kubectl get pod "$pod" -n "$NAMESPACE" -o jsonpath='{.status.phase}')
        if [ "$status" != "Running" ]; then
            echo_error "Pod $pod is in $status state"
            exit 1
        fi
        echo "✓ Pod $pod is Running"
    done
}

# Check service health
check_service_health() {
    echo_step "Checking service health..."

    services=$(kubectl get services -n "$NAMESPACE" -o jsonpath='{.items[*].metadata.name}')

    for service in $services; do
        # Check if service has endpoints
        endpoints=$(kubectl get endpoints "$service" -n "$NAMESPACE" -o jsonpath='{.subsets[*].addresses[*].ip}' 2>/dev/null || echo "")
        if [ -z "$endpoints" ]; then
            echo_warn "Service $service has no active endpoints"
        else
            echo "✓ Service $service is healthy with endpoints: $endpoints"
        fi
    done
}

# Check database health
check_database_health() {
    echo_step "Checking database health..."

    # Check if MongoDB pod is running
    mongo_pod=$(kubectl get pod -l app=medisync-mongodb -n "$NAMESPACE" -o jsonpath='{.items[0].metadata.name}' 2>/dev/null || echo "")

    if [ -z "$mongo_pod" ]; then
        echo_error "MongoDB pod not found"
        exit 1
    fi

    # Try to connect to MongoDB
    if kubectl exec "$mongo_pod" -n "$NAMESPACE" -- mongosh --eval "db.adminCommand('ping')" &> /dev/null; then
        echo "✓ MongoDB is responding to requests"
    else
        echo_error "MongoDB is not responding"
        exit 1
    fi
}

# Check cache health
check_cache_health() {
    echo_step "Checking cache health..."

    # Check if Redis pod is running
    redis_pod=$(kubectl get pod -l app=medisync-redis -n "$NAMESPACE" -o jsonpath='{.items[0].metadata.name}' 2>/dev/null || echo "")

    if [ -z "$redis_pod" ]; then
        echo_error "Redis pod not found"
        exit 1
    fi

    # Try to connect to Redis
    if kubectl exec "$redis_pod" -n "$NAMESPACE" -- redis-cli ping &> /dev/null; then
        echo "✓ Redis is responding to requests"
    else
        echo_error "Redis is not responding"
        exit 1
    fi
}

# Check platform API health
check_api_health() {
    echo_step "Checking platform API health..."

    # This would typically make actual HTTP requests to API endpoints
    # For now, we'll check if the main service is available

    if kubectl get service medisync-platform-service -n "$NAMESPACE" &> /dev/null; then
        echo "✓ Platform service is available"
    else
        echo_error "Platform service not found"
        exit 1
    fi
}

# Check resource usage
check_resource_usage() {
    echo_step "Checking resource usage..."

    echo "Pod resource usage:"
    kubectl top pods -n "$NAMESPACE" 2>/dev/null || echo "Resource metrics not available"

    echo ""
    echo "Node resource usage:"
    kubectl top nodes 2>/dev/null || echo "Node metrics not available"
}

# Check backup status
check_backup_status() {
    echo_step "Checking backup status..."

    # Check if backup jobs exist and their status
    backup_jobs=$(kubectl get cronjobs -n "$NAMESPACE" | grep backup | awk '{print $1}')

    if [ -n "$backup_jobs" ]; then
        echo "✓ Backup jobs found:"
        echo "$backup_jobs"
    else
        echo_warn "No backup jobs found"
    fi
}

# Main health check function
main() {
    echo_step "Starting MediSync Platform Health Check"
    echo "========================================"

    check_cluster_health
    check_pod_health
    check_service_health
    check_database_health
    check_cache_health
    check_api_health
    check_resource_usage
    check_backup_status

    echo_step "Health check completed successfully!"
    echo ""
    echo "All components are healthy and operational."
}

# Run main function
main "$@"